/** January 1st 2020 00:00 */
const NOW = new Date('2020-01-01T00:00:00.000+00:00').getTime();

Date.now = jest.fn().mockImplementation(() => NOW);
