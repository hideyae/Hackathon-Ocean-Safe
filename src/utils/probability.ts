export function calculateProbabilities(data: any) {
    const temps = Object.values(data.properties.parameter.T2M);
    const hotDays = temps.filter((t: number) => t > 32).length; // >32°C
    const coldDays = temps.filter((t: number) => t < 5).length; // <5°C
    const totalDays = temps.length;
    return {
        hot: Math.round((hotDays / totalDays) * 100),
        cold: Math.round((coldDays / totalDays) * 100),
        // Add more as needed
    };
}