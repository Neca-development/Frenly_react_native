/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

const { Platform } = require("react-native");

if (Platform.OS !== "web") {
  require("./global");
}

const { registerRootComponent, scheme } = require("expo");
const { default: App } = require("./App");

if (typeof BigInt === "undefined") {
  const bi = require("big-integer");

  // BugFix for BigInt('0xffffffffffffffff') by CBOR lib
  function myBigInt(value) {
    if (typeof value === "string") {
      const match = value.match(/^0([xo])([0-9a-f]+)$/i);
      if (match) {
        return bi(match[2], match[1].toLowerCase() === "x" ? 16 : 8);
      }
    }
    return bi(value);
  }

  global.BigInt = myBigInt;
}

global.Buffer = global.Buffer || require("buffer").Buffer;

const {
  default: AsyncStorage,
} = require("@react-native-async-storage/async-storage");
const { withWalletConnect } = require("@walletconnect/react-native-dapp");

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(
  withWalletConnect(App, {
    redirectUrl:
      Platform.OS === "web" ? window.location.origin : `${scheme}://`,
    storageOptions: {
      asyncStorage: AsyncStorage,
    },
  })
);
