# @gravity-ui/uikit-codemod &middot; [![npm package](https://img.shields.io/npm/v/@gravity-ui/uikit-codemod)](https://www.npmjs.com/package/@gravity-ui/uikit-codemod) [![CI](https://img.shields.io/github/actions/workflow/status/gravity-ui/uikit-codemod/.github/workflows/ci.yml?branch=main&label=CI&logo=github)](https://github.com/gravity-ui/uikit-codemod/actions/workflows/ci.yml?query=branch:main)

Scripts that help in migration for newer features in `@gravity-ui/uikit`

## Usage
`npx @gravity-ui/uikit-codemod <transform> <path> [...options]`
* `transform` - transform name, see the list below
* `path` - Files or directories to transform
* use flags `--dry` and `--print` to view transform result in "preview" mode (files won't be changed)

## Available transforms

### @gravity-ui@6

#### `6-positive-to-success`

### @gravity-ui@5

#### `5-move-components`

Move components to `@gravity-ui/components` package

#### `5-progress-props`

Remap Progress props

#### `5-popup-props`

Remap Popup props

## jscodeshift arguments
You can pass jscodeshift arguments directly with the `--jscodeshift="..."` flag. For example:
```sh
npx @gravity-ui/uikit-codemod --jscodeshift="--run-in-band --verbose=2"
```
