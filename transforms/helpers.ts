import {Collection, JSCodeshift, StringLiteral, JSXAttribute} from 'jscodeshift';

export interface RemapJSXPropsConfig {
    [name: string]:
        | {
              to: string;
              values?: Record<string, string>;
          }
        | string;
}

export interface ReduceJSXPropsConfig {
    [name: string]: {
        [value: string]: {
            [prop: string]: string | undefined;
        };
    };
}

function findImport(name: string, root: Collection, j: JSCodeshift) {
    return root
        .find(j.ImportDeclaration, {
            source: {value: '@gravity-ui/uikit'},
            importKind: 'value',
        })
        .find(j.ImportSpecifier, {type: 'ImportSpecifier', imported: {name}})
        .nodes()[0];
}

function findImportedNodes(name: string, root: Collection, j: JSCodeshift) {
    return root
        .find(j.JSXElement, {
            openingElement: {
                name: {
                    type: 'JSXIdentifier',
                    name,
                },
            },
        })
        .nodes();
}

function findImportedSubNodes(name: string, root: Collection, j: JSCodeshift) {
    return root
        .find(j.JSXElement, {
            openingElement: {
                name: {
                    type: 'JSXMemberExpression',
                    property: {
                        type: 'JSXIdentifier',
                        name: name,
                    },
                },
            }
        })
        .nodes();
}

export function remapJSXProps(
    componentName: string,
    config: RemapJSXPropsConfig,
    root: Collection,
    j: JSCodeshift,
) {
    const [mainName, childrenName] = componentName.split('.');

    const foundedImport = findImport(mainName, root, j);
    if (!foundedImport) {
        return false;
    }

    const nodes = childrenName ?
        findImportedSubNodes (mainName, root, j)
        : findImportedNodes(
        mainName,
        root,
        j,
    );

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

export function reduceJSXProps(
    name: string,
    config: ReduceJSXPropsConfig,
    root: Collection,
    j: JSCodeshift,
) {
    const foundedImport = findImport(name, root, j);
    if (!foundedImport) {
        return false;
    }

    const nodes = findImportedNodes(
        foundedImport.local?.name || foundedImport.imported.name,
        root,
        j,
    );

    let isUpdated = false;

    nodes.forEach((elem) => {
        elem.openingElement.attributes = elem.openingElement.attributes?.reduce<JSXAttribute[]>(
            (list, attr) => {
                if (attr.type !== 'JSXAttribute' || attr.name.type !== 'JSXIdentifier') {
                    return list;
                }

                const propConfig = config[attr.name.name];
                if (!propConfig) return list;

                if (attr.value?.type === 'StringLiteral' && propConfig[attr.value.value]) {
                    Object.entries(propConfig[attr.value.value] ?? {}).forEach(([name, value]) => {
                        list.push({
                            type: 'JSXAttribute',
                            name: {type: 'JSXIdentifier', name},
                            value: value ? {type: 'StringLiteral', value} : undefined,
                        });
                        isUpdated = true;
                    });
                }

                return list;
            },
            [],
        );
    });

    return isUpdated;
}
