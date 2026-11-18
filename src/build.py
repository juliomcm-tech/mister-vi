import pathlib
S = pathlib.Path(__file__).parent
ui = (S / 'ui.js').read_text().replace('%%FACE%%', (S / 'face.js').read_text())
js = (S / 'engine.js').read_text() + '\n' + ui
out = (S / 'shell.html').read_text().replace('%%SCRIPT%%', js)
(S.parent / 'index.html').write_text(out)
print('index.html', len(out))
