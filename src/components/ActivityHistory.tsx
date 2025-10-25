import { useState, useEffect } from 'react';
import { History, Calendar, MapPin, TrendingUp, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ActivityHistory as ActivityHistoryType } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const ActivityHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<ActivityHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('activity_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading history:', error);
    } else {
      setHistory(data || []);
    }
    setLoading(false);
  };

  const deleteActivity = async (id: string) => {
    const { error } = await supabase
      .from('activity_history')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting activity:', error);
    } else {
      setHistory(history.filter(item => item.id !== id));
    }
  };

  if (!user) {
    return (
      <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-6 text-center">
        <p className="text-cyan-800">Sign in to view your activity history</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 text-center">
        <p className="text-gray-600">Loading history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 text-center">
        <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No activity history yet</p>
        <p className="text-sm text-gray-500 mt-2">Check conditions to start tracking your activities</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <History className="w-6 h-6 text-cyan-600" />
        Activity History
      </h2>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-xs font-semibold capitalize">
                    {item.activity_type}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">{item.score}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-2">{item.overall_status}</p>
              </div>

              <button
                onClick={() => deleteActivity(item.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
