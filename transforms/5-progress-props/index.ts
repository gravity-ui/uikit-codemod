import {API, FileInfo, Options} from 'jscodeshift';

import {remapJSXProps} from '../helpers';

const config = {
    view: {
        to: 'size',
        values: {
            thin: 's',
            thinnest: 'xs',
        },
    },
};

export default function (file: FileInfo, api: API, options: Options) {
    const j = api.jscodeshift;
    const root = j(file.source);

    if (!remapJSXProps('Progress', config, root, j)) {
        return;
    }

    return root.toSource(options.printOptions);
}
