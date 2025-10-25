import { useState, useEffect } from 'react';
import { AlertTriangle, Fish, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ConservationAlert, FishSpecies } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const ConservationAlerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<ConservationAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAlerts();
      checkBreedingSeasonAlerts();
    }
  }, [user]);

  const loadAlerts = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('conservation_alerts')
      .select(`
        *,
        fish_species (*)
      `)
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading alerts:', error);
    } else {
      setAlerts(data || []);
    }
    setLoading(false);
  };

  const checkBreedingSeasonAlerts = async () => {
    if (!user) return;

    const currentMonth = new Date().getMonth() + 1;

    const { data: fishInBreeding, error } = await supabase
      .from('fish_species')
      .select('*')
      .contains('breeding_months', [currentMonth]);

    if (error) {
      console.error('Error checking breeding seasons:', error);
      return;
    }

    if (fishInBreeding && fishInBreeding.length > 0) {
      for (const fish of fishInBreeding) {
        const { error: insertError } = await supabase
          .from('conservation_alerts')
          .insert([{
            user_id: user.id,
            fish_species_id: fish.id,
            alert_type: 'breeding_season',
            message: `${fish.name} is currently in breeding season. Please avoid fishing this species to help preserve population.`,
            is_read: false
          }]);

        if (insertError && !insertError.message.includes('duplicate')) {
          console.error('Error creating alert:', insertError);
        }
      }
      await loadAlerts();
    }
  };

  const markAsRead = async (alertId: string) => {
    const { error } = await supabase
      .from('conservation_alerts')
      .update({ is_read: true })
      .eq('id', alertId);

    if (error) {
      console.error('Error marking alert as read:', error);
    } else {
      setAlerts(alerts.filter(a => a.id !== alertId));
    }
  };

  const dismissAlert = async (alertId: string) => {
    const { error } = await supabase
      .from('conservation_alerts')
      .delete()
      .eq('id', alertId);

    if (error) {
      console.error('Error dismissing alert:', error);
    } else {
      setAlerts(alerts.filter(a => a.id !== alertId));
    }
  };

  if (!user || alerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-3">
      {alerts.slice(0, 3).map((alert) => (
        <div
          key={alert.id}
          className="bg-white border-2 border-amber-300 rounded-xl shadow-2xl p-4 animate-slide-in"
        >
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-2 flex-shrink-0">
              {alert.alert_type === 'breeding_season' ? (
                <Fish className="w-5 h-5 text-white" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-bold text-gray-800 text-sm">
                  {alert.alert_type === 'breeding_season' ? 'Breeding Season Alert' : 'Conservation Alert'}
                </h4>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {alert.fish_species && (
                <p className="text-xs font-semibold text-amber-700 mb-1">
                  {alert.fish_species.name}
                </p>
              )}

              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                {alert.message}
              </p>

              <button
                onClick={() => markAsRead(alert.id)}
                className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
              >
                <Check className="w-3 h-3" />
                Mark as read
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
