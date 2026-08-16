from pathlib import Path
from PIL import Image

project = Path('/home/ubuntu/gerador-senhas-mobile')
source = project / 'assets/images/icon.png'
image = Image.open(source).convert('RGB')
outputs = {
    'icon.png': (512, 512),
    'splash-icon.png': (512, 512),
    'favicon.png': (192, 192),
    'android-icon-foreground.png': (432, 432),
}
for name, size in outputs.items():
    target = project / 'assets/images' / name
    resized = image.resize(size, Image.Resampling.LANCZOS)
    resized.save(target, format='PNG', optimize=True)
    print(f'{target}: {target.stat().st_size} bytes')
