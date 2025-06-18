// src/extension.ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const config = () => vscode.workspace.getConfiguration('folderDepthColorizer');

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

        const colors = config().get<string[]>('colors', [
            '#e0e0e0', '#d0d0ff', '#c0ffc0', '#ffd0d0', '#fffac0', '#d0f0ff'
        ]);
        const width = config().get<number>('barWidth', 3);

        const color = colors[depth % colors.length];
        const badge = ' '.repeat(width);

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
