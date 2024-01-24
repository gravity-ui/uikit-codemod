import {Collection, JSCodeshift, StringLiteral} from 'jscodeshift';

export interface RemapJSXPropsConfig {
    [name: string]:
        | {
              to: string;
              values?: Record<string, string>;
          }
        | string;
}

export function remapJSXProps(
    name: string,
    config: RemapJSXPropsConfig,
    root: Collection,
    j: JSCodeshift,
) {
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

    const nodes = root
        .find(j.JSXElement, {
            openingElement: {
                name: {
                    type: 'JSXIdentifier',
                    name: foundImport.local?.name || foundImport.imported.name,
                },
            },
        })
        .nodes();

    let isUpdated = false;

    nodes.forEach((elem) => {
        elem.openingElement.attributes?.forEach((attr) => {
            if (attr.type !== 'JSXAttribute' || attr.name.type !== 'JSXIdentifier') {
                return;
            }

            // handle prop name
            let propMatch = config[attr.name.name];
            if (!propMatch) return;

            propMatch = typeof propMatch === 'string' ? {to: propMatch} : propMatch;
            if (attr.name.name !== propMatch.to) {
                attr.name = j.jsxIdentifier(propMatch.to);
                isUpdated = true;
            }

            // handle prop value
            if (!propMatch.values) return;

            const originalProp = attr.value as StringLiteral;
            if (!originalProp.value) return;

            const valueMatch = propMatch.values[originalProp.value];
            if (!valueMatch) return;

            if (originalProp.value !== valueMatch) {
                originalProp.value = valueMatch;
                isUpdated = true;
            }
        });
    });

    return isUpdated;
}
