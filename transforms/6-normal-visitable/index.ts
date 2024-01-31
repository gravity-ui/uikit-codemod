import {API, FileInfo, Options} from 'jscodeshift';

import {ReduceJSXPropsConfig, reduceJSXProps} from '../helpers';

const config: ReduceJSXPropsConfig = {
    view: {
        'normal-visitable': {
            view: 'normal',
            visitable: undefined,
        },
    },
};

export default function (file: FileInfo, api: API, options: Options) {
    const j = api.jscodeshift;
    const root = j(file.source);

    if (!reduceJSXProps('Link', config, root, j)) {
        return;
    }

    return root.toSource(options.printOptions);
}
