import {
    API,
    Collection,
    FileInfo,
    Identifier,
    JSCodeshift,
    ObjectProperty,
    Options,
} from 'jscodeshift';

export default function (file: FileInfo, api: API, options: Options) {
    const j = api.jscodeshift;
    const root = j(file.source);

    const hasHookUpdate = updateHookUsages(root, j);
    const hasTypeUpdate = updateTypeUsages(root, j);

    if (!hasHookUpdate && !hasTypeUpdate) {
        return undefined;
    }

    return root.toSource(options.printOptions);
}

function updateHookUsages(root: Collection, j: JSCodeshift): boolean {
    const foundImport = root
        .find(j.ImportDeclaration, {
            source: {value: '@gravity-ui/uikit'},
            importKind: 'value',
        })
        .find(j.ImportSpecifier, {type: 'ImportSpecifier', imported: {name: 'useToaster'}})
        .nodes()[0];

    if (!foundImport) {
        return false;
    }

    const localName = foundImport.local?.name || foundImport.imported.name;
    let isUpdated = false;

    root.find(j.VariableDeclarator, {
        init: {type: 'CallExpression', callee: {name: localName}},
    }).forEach((path) => {
        let callExpressions;

        if (path.node.id.type === 'Identifier') {
            const varName = path.node.id.name;

            callExpressions = j(path)
                .closestScope()
                .find(j.MemberExpression, {
                    object: {type: 'Identifier', name: varName},
                    property: {type: 'Identifier', name: 'add'},
                })
                .closest(j.CallExpression);
        } else if (path.node.id.type === 'ObjectPattern') {
            const addProperty = path.node.id.properties.find(
                (property) =>
                    property.type === 'ObjectProperty' &&
                    property.key.type === 'Identifier' &&
                    property.key.name === 'add' &&
                    property.value.type === 'Identifier',
            ) as ObjectProperty | undefined;

            if (!addProperty) {
                return;
            }

            const varName = (addProperty.value as Identifier).name;

            callExpressions = j(path)
                .closestScope()
                .find(j.CallExpression, {callee: {type: 'Identifier', name: varName}});
        }

        if (callExpressions) {
            callExpressions.forEach((path) => {
                const firstArg = path.node.arguments[0];

                if (!firstArg || firstArg.type !== 'ObjectExpression') {
                    return;
                }

                firstArg.properties.forEach((property) => {
                    if (property.type !== 'ObjectProperty') {
                        return;
                    }

                    if (property.key.type === 'Identifier' && property.key.name === 'type') {
                        property.key.name = 'theme';

                        if (property.shorthand) {
                            property.shorthand = false;
                        }

                        if (
                            property.value.type === 'StringLiteral' &&
                            property.value.value === 'error'
                        ) {
                            property.value.value = 'danger';
                        }

                        isUpdated = true;
                    }
                });
            });
        }
    });

    return isUpdated;
}

function updateTypeUsages(root: Collection, j: JSCodeshift): boolean {
    const foundImport = root
        .find(j.ImportDeclaration, {source: {value: '@gravity-ui/uikit'}})
        .find(j.ImportSpecifier, {type: 'ImportSpecifier', imported: {name: 'ToastType'}})
        .nodes()[0];

    if (!foundImport) {
        return false;
    }

    foundImport.imported.name = 'ToastTheme';

    const localName = foundImport.local?.name || foundImport.imported.name;

    root.find(j.TSTypeAnnotation)
        .find(j.Identifier, {name: localName})
        .forEach((path) => {
            if (localName === 'ToastType') {
                path.node.name = 'ToastTheme';
            }
        });

    return true;
}
