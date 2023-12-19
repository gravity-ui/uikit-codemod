import {API, FileInfo, Options} from 'jscodeshift';

import {remapJSXProps} from '../helpers';

const config = {
    size: {
        to: 'size',
        values: {
            left: 'start',
            right: 'end',
        },
    },
};

export default function (file: FileInfo, api: API, options: Options) {
    const j = api.jscodeshift;
    const root = j(file.source);

    if (
        !remapJSXProps('ButtonIcon', config, root, j) &&
        !remapJSXProps('Button.Icon', config, root, j) &&
        !remapJSXProps('Disclosure', config, root, j)
    ) {
        return;
    }

    return root.toSource(options.printOptions);
}
