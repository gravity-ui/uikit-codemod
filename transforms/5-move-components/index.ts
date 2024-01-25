import {API, ASTPath, FileInfo, ImportDeclaration, Options} from 'jscodeshift';

const MOVED_COMPONENTS = [
    'ChangelogDialog',
    'Stories',
    'StoriesGroup',
    'HelpPopover',
    'SharePopover',
    'ShareList',
    'ShareOptions',
    'ShareLayoutDirection',
    'PromoSheet',
    'StoreBadge',
];
const MOVED_COMPONENTS_TYPES = [
    'ChangelogDialogProps',
    'ChangelogItem',
    'StoriesProps',
    'StoriesItemMedia',
    'StoriesItem',
    'StoriesGroupProps',
    'StoriesGroupItem',
    'HelpPopoverProps',
    'ShareListProps',
    'SharePopoverProps',
    'PromoSheetProps',
    'StoreBadgePlatform',
    'StoreBadgeProps',
];

export default function (file: FileInfo, api: API, options: Options) {
    const j = api.jscodeshift;
    const root = j(file.source);

    const uikitImportPath = root
        .find(j.ImportDeclaration, {source: {value: '@gravity-ui/uikit'}, importKind: 'value'})
        .paths()[0];
    const uikitTypesImportPath = root
        .find(j.ImportDeclaration, {source: {value: '@gravity-ui/uikit'}, importKind: 'type'})
        .paths()[0];

    const uikitImportResult = moveImportMembers(uikitImportPath);
    const uikitTypesImportResult = moveImportMembers(uikitTypesImportPath);

    if (!uikitImportResult && !uikitTypesImportResult) {
        return;
    }

    return root.toSource({...options.printOptions});

    function moveImportMembers(path?: ASTPath<ImportDeclaration>) {
        if (!path || path.node.specifiers?.length === 0) {
            return false;
        }

        const membersToMove: Array<{name: string; localName?: string}> = [];

        for (const specifier of path.node.specifiers!) {
            if (specifier.type !== 'ImportSpecifier') {
                continue;
            }

            const name = specifier.imported.name;
            const localName = specifier.local?.name;
            const matchAgainst = [...MOVED_COMPONENTS_TYPES];

            if (path.node.importKind === 'value') {
                matchAgainst.push(...MOVED_COMPONENTS);
            }

            if (matchAgainst.includes(name)) {
                membersToMove.push({name, localName});
            }
        }

        if (membersToMove.length === 0) {
            return false;
        }

        const newImportPath = root
            .find(j.ImportDeclaration, {
                source: {value: '@gravity-ui/components'},
                importKind: path.node.importKind,
            })
            .paths()[0];
        let newImport: ImportDeclaration;

        if (newImportPath) {
            newImport = newImportPath.node;
        } else {
            newImport = j.importDeclaration(
                [],
                j.stringLiteral('@gravity-ui/components'),
                path.node.importKind,
            );
            path.insertBefore(newImport);
        }

        for (const member of membersToMove) {
            path.node.specifiers = path.node.specifiers!.filter((s) => {
                return s.type !== 'ImportSpecifier' || s.imported.name !== member.name;
            });
            newImport.specifiers!.push(
                j.importSpecifier(
                    j.identifier(member.name),
                    member.localName ? j.identifier(member.localName) : null,
                ),
            );
        }

        if (path.node.specifiers!.length === 0) {
            path.prune();
        }

        return true;
    }
}
