// A helper function to parse seat ranges. You can place this in a utils file.
const parseSeatRanges = (seatConfig) => {
    const allSeats = [];
    const allSeatNumbers = new Set();
    let totalSeats = 0;

    for (const config of seatConfig) {
        const { type, ranges } = config;
        const numbers = ranges.split(',')
            .flatMap(part => {
                part = part.trim();
                if (part.includes('-')) {
                    const [start, end] = part.split('-').map(Number);
                    if (isNaN(start) || isNaN(end) || start <= 0 || start > end) {
                        throw new Error(`Invalid range format: "${part}"`);
                    }
                    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
                }
                const num = Number(part);
                if (isNaN(num) || num <= 0) {
                    throw new Error(`Invalid seat number: "${part}"`);
                }
                return num;
            });

        for (const num of numbers) {
            if (allSeatNumbers.has(num)) {
                throw new Error(`Duplicate seat number found: ${num}`);
            }
            allSeatNumbers.add(num);
            allSeats.push({ number: num, type });
        }
        totalSeats += numbers.length;
    }
    return { allSeats, totalSeats };
};
module.exports = { parseSeatRanges };