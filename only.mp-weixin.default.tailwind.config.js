const plugin = require('tailwindcss/plugin')

const isH5 = process.env.UNI_PLATFORM === 'h5'

module.exports = {
  darkMode: 'class',
  purge: {
    content: ['./src/**/*.vue', './src/**/*.wxml'],
  },
  corePlugins: [
    isH5 ? 'preflight' : 'container',
    'alignContent',
    'alignItems',
    'backgroundColor',
    'backgroundPosition',
    'backgroundRepeat',
    'backgroundSize',
    'borderColor',
    'borderRadius',
    'borderStyle',
    'borderWidth',
    'boxSizing',
    'clear',
    'cursor',
    'display',
    'fill',
    'flex',
    'flexDirection',
    'flexGrow',
    'flexShrink',
    'flexWrap',
    'fontSize',
    'fontWeight',
    'height',
    'inset',
    'justifyItems',
    'justifyContent',
    'lineHeight',
    'margin',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',
    'objectFit',
    'objectPosition',
    'opacity',
    'overflow',
    'position',
    'padding',
    'placeholderColor',
    'placeholderOpacity',
    'rotate',
    'scale',
    'tableLayout',
    'textAlign',
    'textColor',
    'textDecoration',
    'textOverflow',
    'textTransform',
    'transform',
    'transformOrigin',
    'transitionDelay',
    'transitionDuration',
    'transitionProperty',
    'transitionTimingFunction',
    'translate',
    'userSelect',
    'verticalAlign',
    'visibility',
    'whitespace',
    'width',
    'wordBreak',
    'zIndex'
  ],
  variants: {
    accessibility: [],
    alignContent: [],
    alignItems: [],
    alignSelf: [],
    appearance: [],
    backgroundAttachment: [],
    backgroundColor: ['dark', 'active', 'disabled'],
    backgroundPosition: [],
    backgroundRepeat: [],
    backgroundSize: [],
    borderCollapse: [],
    borderColor: [],
    borderRadius: [],
    borderStyle: [],
    borderWidth: [],
    boxShadow: [],
    cursor: [],
    display: [],
    fill: [],
    flex: [],
    flexDirection: [],
    flexGrow: [],
    flexShrink: [],
    flexWrap: [],
    float: [],
    fontFamily: [],
    fontSize: [],
    fontSmoothing: [],
    fontStyle: [],
    fontWeight: [],
    height: [],
    inset: [],
    justifyContent: [],
    letterSpacing: [],
    lineHeight: [],
    listStylePosition: [],
    listStyleType: [],
    margin: [],
    maxHeight: [],
    maxWidth: [],
    minHeight: [],
    minWidth: [],
    objectFit: [],
    objectPosition: [],
    opacity: ['disabled'],
    order: [],
    outline: [],
    overflow: [],
    padding: [],
    placeholderColor: [],
    pointerEvents: [],
    position: [],
    resize: [],
    stroke: [],
    tableLayout: [],
    textAlign: [],
    textColor: ['dark', 'active'],
    textDecoration: [],
    textTransform: [],
    userSelect: [],
    verticalAlign: [],
    visibility: [],
    whitespace: [],
    width: [],
    wordBreak: [],
    zIndex: [],
  },
  theme: {
    screens: false,
    spacing: {
      px: '1px',
      0: '0px',
      '0_5': '0.125rem',
      1: '0.25rem',
      '1_5': '0.375rem',
      2: '0.5rem',
      '2_5': '0.625rem',
      3: '0.75rem',
      '3_5': '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    minHeight: {
      0: '0upx',
      full: '100%',
      screen: '100vh',
    },
    outline: {
      none: ['4upx solid transparent', '4upx'],
      white: ['4upx dotted white', '4upx'],
      black: ['4upx dotted black', '4upx'],
    },
    extend: {},
  },
  plugins: [
    plugin(function ({ addComponents }) {
      const testComponents = {
        '.shadow': {
          boxShadow:
            '0 2upx 6upx 0 rgba(0, 0, 0, 0.1), 0 2upx 4upx 0 rgba(0, 0, 0, 0.06)',
        },
      }
      addComponents(testComponents)
    })
  ],
}
