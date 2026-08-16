# Design do aplicativo — Gerador de Senhas

## Direção do produto

O aplicativo será uma ferramenta mobile simples, rápida e confiável para gerar senhas personalizadas e copiá-las para a área de transferência. A experiência deve parecer uma ferramenta nativa do iOS: hierarquia visual clara, controles grandes para uso com uma mão, feedback imediato e poucos elementos concorrentes.

## Orientação e composição

A interface será desenhada para orientação portrait 9:16. A tela principal usará uma coluna vertical com margens laterais de 20–24 px, áreas de toque confortáveis e rolagem apenas quando necessário. O conteúdo mais importante ficará na metade superior da tela: senha gerada, nível de segurança e ação de copiar.

## Tela principal — Gerador

A tela terá um cabeçalho com ícone de cadeado e o título “Gerador de Senhas”, seguido de uma descrição curta: “Crie uma senha forte em segundos”.

O elemento central será um cartão de resultado com a senha atual em fonte monoespaçada, botão de copiar e indicador de força. O cartão terá fundo elevado, borda discreta e cantos arredondados. Abaixo dele, haverá um seletor de tamanho com controles de diminuir e aumentar, além de quatro opções: letras maiúsculas, letras minúsculas, números e símbolos.

No final da tela ficará o botão primário “Gerar nova senha”. Depois de copiar, o botão ou uma mensagem contextual exibirá “Senha copiada” por alguns segundos.

## Funcionalidades principais

- Gerar senha aleatória usando as categorias selecionadas.
- Ajustar o tamanho da senha entre 6 e 32 caracteres.
- Ativar ou desativar letras maiúsculas, letras minúsculas, números e símbolos.
- Avaliar a senha como fraca, média ou forte.
- Copiar a senha para a área de transferência.
- Mostrar feedback visual e tátil em ações principais, quando disponível.

## Fluxo principal

1. O usuário abre o aplicativo e vê uma senha gerada automaticamente.
2. O usuário ajusta o tamanho ou as categorias de caracteres.
3. O usuário toca em “Gerar nova senha”.
4. O cartão atualiza a senha e o indicador de força.
5. O usuário toca em “Copiar senha”.
6. O aplicativo confirma a cópia com uma mensagem breve.

## Paleta de cores

- Fundo: `#0B1220`, azul-marinho profundo.
- Superfície: `#151F33`, azul ardósia para cartões.
- Superfície secundária: `#1D2A42`.
- Texto principal: `#F8FAFC`.
- Texto secundário: `#94A3B8`.
- Cor primária: `#6D5EF7`, violeta para ações principais.
- Cor de sucesso: `#34D399`.
- Cor de atenção: `#FBBF24`.
- Cor de erro: `#FB7185`.
- Borda: `#263653`.

## Tipografia e interação

Os títulos serão fortes e compactos. A senha usará fonte monoespaçada para facilitar a leitura dos caracteres. Os botões terão altura mínima aproximada de 52 px, feedback de opacidade e leve redução de escala durante o toque. A interface não utilizará animações decorativas antes de a funcionalidade estar estável.

## Estado vazio e acessibilidade

Não haverá estado vazio obrigatório, pois uma senha inicial será gerada na abertura. Caso todas as categorias sejam desativadas, o aplicativo deverá impedir a geração e explicar como corrigir a configuração. Os textos terão contraste alto, os controles terão rótulos claros e os elementos interativos deverão ser acessíveis por leitor de tela.
