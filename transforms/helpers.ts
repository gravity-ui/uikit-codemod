import {Collection, JSCodeshift, StringLiteral} from 'jscodeshift';

export interface RemapJSXPropsConfig {
    [name: string]:
        | {
        to: string;
        values?: Record<any, string>;
    }
        | string;
}

export function remapJSXProps(name: string, config: RemapJSXPropsConfig, root: Collection, j: JSCodeshift) {
    const foundImport = root
        .find(j.ImportDeclaration, {
            source: {value: '@gravity-ui/uikit'},
            importKind: 'value',
        })
        .find(j.ImportSpecifier, {type: 'ImportSpecifier', imported: {name}})
        .nodes()[0];

    if (!foundImport) {
        return false;
    }

    root.find(j.JSXElement, {
        openingElement: {
            name: {
                type: 'JSXIdentifier',
                name: foundImport.local?.name || foundImport.imported.name,
            },
        },
    })
        .nodes()
        .forEach((elem) => {
            elem.openingElement.attributes?.forEach((attr) => {
                if (attr.type !== 'JSXAttribute' || attr.name.type !== 'JSXIdentifier') {
                    return;
                }

                let propMatch = config[attr.name.name];

                if (propMatch) {
                    propMatch = typeof propMatch === 'string' ? {to: propMatch} : propMatch;
                    attr.name = j.jsxIdentifier(propMatch.to);

                    if (propMatch.values && (attr.value as StringLiteral).value !== undefined) {
                        const valueMatch = propMatch.values[(attr.value as StringLiteral).value];

                        if (valueMatch) {
                            (attr.value as StringLiteral).value = valueMatch;
                        }
                    }
                }
            });
        });

    return true;
}
