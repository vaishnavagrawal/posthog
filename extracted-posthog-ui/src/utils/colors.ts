export const POSTHOG_PALETTE = [
    '#1d4aff', // blue
    '#1f9d55', // green
    '#f89c1e', // orange
    '#f14d4d', // red
    '#00d2ff', // cyan
    '#ea4a8f', // pink
    '#6432ff', // purple
    '#4422aa', // indigo
];

export function getGraphColors(index: number) {
    return POSTHOG_PALETTE[index % POSTHOG_PALETTE.length];
}
