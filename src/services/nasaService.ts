export async function fetchNasaWeatherStats(lat: number, lon: number, start: string, end: string) {
    const response = await fetch(
        `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,WS2M,PRECTOT&community=RE&longitude=${lon}&latitude=${lat}&start=${start}&end=${end}&format=JSON`
    );
    if (!response.ok) throw new Error('NASA API error');
    return response.json();
}