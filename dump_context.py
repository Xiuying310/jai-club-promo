import os

IGNORE_DIRS = {'.git', 'node_modules', '__pycache__', '.venv', '.gemini', '.playwright-mcp'}
IGNORE_FILES = {'.DS_Store', '.env', 'codebase_context.txt', 'dump_context.py'}
EXTENSIONS = {'.py', '.js', '.ts', '.tsx', '.html', '.css', '.json', '.jsonc', '.md', '.txt', '.svg'}

def generate_tree(startpath):
    tree = []
    for root, dirs, files in os.walk(startpath):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * level
        tree.append(f'{indent}{os.path.basename(root)}/')
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            if f not in IGNORE_FILES:
                tree.append(f'{subindent}{f}')
    return '\n'.join(tree)

def dump_codebase(startpath, output_file):
    with open(output_file, 'w', encoding='utf-8') as out:
        out.write("# Project Structure\n\n")
        out.write("```\n")
        out.write(generate_tree(startpath))
        out.write("\n```\n\n")
        out.write("# Source Code\n\n")
        
        for root, dirs, files in os.walk(startpath):
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            for f in files:
                if f in IGNORE_FILES:
                    continue
                
                ext = os.path.splitext(f)[1].lower()
                if ext not in EXTENSIONS:
                    continue
                
                file_path = os.path.join(root, f)
                rel_path = os.path.relpath(file_path, startpath)
                
                out.write(f"## File: {rel_path}\n")
                out.write(f"```{ext[1:] if ext else ''}\n")
                try:
                    with open(file_path, 'r', encoding='utf-8') as src:
                        out.write(src.read())
                except Exception as e:
                    out.write(f"Error reading file: {e}")
                out.write("\n```\n\n")

if __name__ == "__main__":
    output = 'codebase_context.txt'
    dump_codebase('.', output)
    print(f"Codebase dumped to {output}")
