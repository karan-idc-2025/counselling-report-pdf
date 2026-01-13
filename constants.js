// Color constants
const COLORS = {
    purple: '#6C4CF1',
    lightPurple: '#9F7AEA',
    white: '#FFFFFF',
    black: '#1A1A1A',
    gray: '#6B7280',
    lightGray: '#E5E7EB',
    blue: '#3B82F6',
    yellow: '#F59E0B'
};

// Page constants
const PAGE = {
    width: 595.28,
    height: 841.89,
    margin: 35,
    get usableWidth() { return this.width - (this.margin * 2); }
};

module.exports = { COLORS, PAGE };

