import {API, FileInfo, Options} from 'jscodeshift';

import {remapJSXProps} from '../helpers';

const config = {
    theme: {
        to: 'theme',
        values: {
            positive: 'success',
        },
    },
};

export default function (file: FileInfo, api: API, options: Options) {
    const j = api.jscodeshift;
    const root = j(file.source);

    if (
        !Math.max(
            Number(remapJSXProps('Alert', config, root, j)),
            Number(remapJSXProps('Card', config, root, j)),
        )
    ) {
        return undefined;
    }

    return root.toSource(options.printOptions);
}
