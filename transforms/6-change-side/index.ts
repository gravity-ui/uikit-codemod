import {API, FileInfo, Options} from 'jscodeshift';

import {remapJSXProps} from '../helpers';

const config = {
    side: {
        to: 'side',
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
        !Math.max(
            Number(remapJSXProps('Button.Icon', config, root, j)),
            Number(remapJSXProps('ButtonIcon', config, root, j)),
            Number(remapJSXProps('Disclosure', config, root, j)),
        )
    ) {
        return;
    }

    return root.toSource(options.printOptions);
}
