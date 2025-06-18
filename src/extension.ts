import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const config = () => vscode.workspace.getConfiguration('colorizedDirectory');

    const emitter = new vscode.EventEmitter<vscode.Uri>();
    const provider: vscode.FileDecorationProvider = {
        onDidChangeFileDecorations: emitter.event,

        provideFileDecoration(uri: vscode.Uri): vscode.ProviderResult<vscode.FileDecoration> {
            if (!vscode.workspace.workspaceFolders) return;
            const root = vscode.workspace.workspaceFolders[0].uri.fsPath;
            const path = uri.fsPath;

            if (!path.startsWith(root)) return;
            const relative = path.substring(root.length).replace(/^\/+/, '');
            const depth = relative.split(/[\\\/]/).length - 1;

            // Theme colors to cycle through for badge coloring
            const themeColors = [
                'charts.blue',
                'charts.green',
                'charts.yellow',
                'charts.red',
                'charts.purple',
                'charts.orange'
            ];

            const badge = '|';

            const colorKey = themeColors[depth % themeColors.length];
            const color = new vscode.ThemeColor(colorKey);

            return {
                badge,
                tooltip: `Depth ${depth}`,
                color,
                propagate: false
            };
        },
    };

    context.subscriptions.push(
        vscode.window.registerFileDecorationProvider(provider),
        emitter
    );
}

export function deactivate() {}
