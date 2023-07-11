import {API, FileInfo, Options} from 'jscodeshift';

import {remapJSXProps} from '../helpers';

const popupConfig = {
    className: 'contentClassName',
};
const popoverConfig = {
    tooltipClassName: 'tooltipContentClassName',
};

export default function (file: FileInfo, api: API, options: Options) {
    const j = api.jscodeshift;
    const root = j(file.source);

    if (
        !Math.max(
            Number(remapJSXProps('Popup', popupConfig, root, j)),
            Number(remapJSXProps('Popover', popoverConfig, root, j)),
            Number(remapJSXProps('SharePopover', popoverConfig, root, j)),
            Number(remapJSXProps('HelpPopover', popoverConfig, root, j)),
        )
    ) {
        return;
    }

    return root.toSource(options.printOptions);
}
