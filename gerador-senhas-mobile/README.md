# Entropia - Aleatoriedade de verdade, no seu bolso.

Aplicativo mobile feito em React Native com Expo que cria senhas aleatórias fortes
diretamente no dispositivo, sem enviar nada para a internet.

## O que ele resolve

Senhas reutilizadas ou previsíveis ("joao123", "senha@2024") são a porta de entrada
mais comum para invasão de contas. O problema é que ninguém consegue inventar de
cabeça uma sequência realmente aleatória — nosso cérebro sempre cai em padrões.

Os geradores online resolvem a aleatoriedade, mas criam outro risco: você digita
o endereço de um site desconhecido e recebe de volta uma senha que aquele servidor
acabou de ver. Este app corta esse intermediário. Toda a geração acontece no
celular, offline, e a senha só sai dali quando você toca em "Copiar senha".

Em resumo, ele entrega:

- Senhas aleatórias de 6 a 32 caracteres
- Controle sobre quais tipos de caractere entram (maiúsculas, minúsculas, números, símbolos)
- Um indicador visual de força, para você entender o que está criando
- Cópia para a área de transferência com um toque
- Funcionamento 100% local — sem conta, sem servidor, sem histórico

## Principais componentes

### `app/(tabs)/index.tsx` — a tela principal

É o coração visual do app e concentra todo o estado da interface:

| Estado | Função |
|---|---|
| `length` | Tamanho da senha (6 a 32) |
| `password` | A senha gerada no momento |
| `options` | Quais dos 4 conjuntos de caracteres estão ativos |
| `copied` | Controla o feedback "Senha copiada" (some após 2,2s) |

Três ações principais:

- **`generate()`** — chama o gerador, guarda o resultado e dispara um retorno tátil leve
- **`copyPassword()`** — envia para a área de transferência e dispara um retorno tátil de sucesso
- **`toggleOption(key)`** — liga/desliga um tipo de caractere, com uma trava: se
  só resta uma opção ativa, ela não pode ser desligada (senão o alfabeto ficaria vazio)

A tela é dividida em quatro blocos: cabeçalho, cartão da senha (com medidor de
força e botão copiar), controles de personalização (tamanho + switches) e o botão
de gerar.

### `lib/password-generator.ts` — a lógica pura

Aqui mora toda a regra de negócio, separada da interface. Não importa nada do
React Native, o que torna o arquivo fácil de testar e reaproveitar.

- **`CHARSETS`** — os quatro alfabetos disponíveis:
  - `uppercase`: `A–Z`
  - `lowercase`: `a–z`
  - `numbers`: `0–9`
  - `symbols`: `!@#$%&*?+-_`
- **`createPassword(length, options)`** — junta os alfabetos das opções ativas em
  uma única string e sorteia um caractere por vez até completar o tamanho pedido
- **`getStrength(password, options)`** — devolve `{ label, color, percent }` para
  alimentar o medidor visual

### `components/screen-container.tsx`

Resolve o problema da "área segura" (notch, câmera, barra de status, barra de
gestos). Usa duas camadas: uma `View` externa que pinta o fundo na tela inteira e
uma `SafeAreaView` interna que mantém o conteúdo dentro dos limites visíveis.
Sem isso, o título ficaria embaixo do relógio do celular.

### `hooks/use-colors.ts`

Devolve a paleta do tema atual (claro ou escuro), lendo a preferência do sistema.
A tela principal força o tema escuro com `useColors("dark")`.

### `app/_layout.tsx` e `app/(tabs)/_layout.tsx`

O primeiro é o layout raiz, onde ficam os *providers* globais. O segundo monta a
barra de abas — hoje com uma única aba, "Home".

## Estrutura de diretórios

O roteamento usa **expo-router**: cada arquivo dentro de `app/` vira uma rota
automaticamente, sem arquivo de configuração.

```
app/                      Rotas (a estrutura de pastas define a navegação)
├── _layout.tsx           Layout raiz — providers globais
├── (tabs)/
│   ├── _layout.tsx       Barra de abas
│   └── index.tsx         ← TELA PRINCIPAL (rota "/")
├── dev/theme-lab.tsx     Tela auxiliar para testar o tema
└── oauth/callback.tsx    Retorno de login (não usado por este app)

lib/
├── password-generator.ts ← LÓGICA DE GERAÇÃO E FORÇA
├── theme-provider.tsx    Provedor de tema
├── utils.ts              Utilitários (ex.: cn, para juntar classes CSS)
└── trpc.ts               Cliente de API (herdado do template)

components/               Componentes reutilizáveis de interface
├── screen-container.tsx  Tratamento de área segura
├── haptic-tab.tsx        Aba com retorno tátil
└── ui/                   Ícones e primitivos

hooks/                    Hooks personalizados (tema, cores, autenticação)
constants/theme.ts        Paletas de cores clara e escura
assets/images/            Ícones e imagens
tests/                    Testes automatizados (Vitest)

server/, shared/, drizzle/   Backend do template — não usados pelo gerador
```

A pasta `(tabs)` está entre parênteses de propósito: isso é um *route group* do
expo-router. Ele agrupa arquivos e aplica um layout comum, mas **não aparece na
URL**. Por isso a rota final é `/` e não `/tabs`.

Vale notar a separação principal: **interface fica em `app/` e `components/`,
regra de negócio fica em `lib/`**. Você pode redesenhar a tela inteira sem tocar
na lógica de geração, e vice-versa.

## Como a senha é classificada

A classificação usa um sistema de pontos. Cada critério atendido soma 1 ponto,
num total possível de 6:

| Critério | Pontos |
|---|---|
| Senha tem 10 caracteres ou mais | +1 |
| Senha tem 16 caracteres ou mais | +1 |
| Letras maiúsculas ativadas | +1 |
| Letras minúsculas ativadas | +1 |
| Números ativados | +1 |
| Símbolos ativados | +1 |

Os dois critérios de tamanho são cumulativos: uma senha de 20 caracteres ganha
os dois pontos (passou de 10 **e** passou de 16).

A soma final define o rótulo:

| Pontuação | Classificação | Cor | Barra |
|---|---|---|---|
| 5 ou 6 | **Forte** | Verde (`#34D399`) | 100% |
| 3 ou 4 | **Média** | Amarelo (`#FBBF24`) | 62% |
| 0 a 2 | **Fraca** | Vermelho (`#FB7185`) | 32% |

Antes da primeira geração, quando ainda não existe senha, o app mostra
"Selecione uma opção" em cinza com a barra zerada.

### Exemplos práticos

| Configuração | Conta | Resultado |
|---|---|---|
| 8 caracteres, só minúsculas | 1 | Fraca |
| 8 caracteres, os 4 tipos | 4 | Média |
| 12 caracteres, os 4 tipos | 1 + 4 = 5 | Forte |
| 16 caracteres, 3 tipos | 2 + 3 = 5 | Forte |
| 32 caracteres, os 4 tipos | 2 + 4 = 6 | Forte |

### Limitações do critério

Vale entender que essa fórmula é uma **heurística didática**, não uma medida real
de segurança. Dois pontos em que ela discorda da criptografia:

1. **Ela olha os switches, não a senha.** A pontuação considera quais opções estão
   ligadas, não quais caracteres de fato saíram no sorteio. Uma senha curta pode,
   por azar, não conter nenhum símbolo e ainda assim pontuar por "símbolos ativados".
   Como consequência, mexer nos switches depois de gerar altera o rótulo sem que a
   senha exibida tenha mudado.

2. **Ela subestima o tamanho.** Uma senha de 30 caracteres só com minúsculas é
   classificada como "Média", embora na prática seja muito mais difícil de quebrar
   que uma de 8 caracteres com os 4 tipos, que aparece como "Média" também. Na
   teoria da informação, o comprimento pesa mais que a variedade do alfabeto.

O cálculo mais fiel seria a entropia — `comprimento × log₂(tamanho do alfabeto)` —
medida em bits. Mas o sistema de pontos é mais fácil de explicar e de visualizar,
o que faz sentido para o propósito do app.

## Testes automatizados

O projeto usa **Vitest**, com os testes em `tests/password-generator.test.ts`.
Para rodar:

```bash
pnpm test
```

### O truque que torna o aleatório testável

Testar um gerador aleatório parece contraditório: se o resultado muda a cada
execução, como afirmar que ele está certo? A solução está na assinatura da função:

```ts
createPassword(length, options, random = Math.random)
```

O terceiro parâmetro é a **fonte de aleatoriedade injetada**. Em produção ninguém
passa esse argumento e ele cai no padrão `Math.random`. Nos testes, passa-se uma
função falsa e previsível — e aí o resultado vira determinístico.

Com `() => 0`, o sorteio sempre escolhe o primeiro caractere do alfabeto, então
o teste consegue afirmar exatamente o que deve sair:

```ts
const password = createPassword(16, allOptions, () => 0);
expect(password).toBe("A".repeat(16));
```

Essa técnica chama-se **injeção de dependência** e é o que permite verificar uma
função aleatória sem depender da sorte.

### Os quatro casos cobertos

| Teste | O que garante |
|---|---|
| Tamanho solicitado | A senha sai com exatamente o número de caracteres pedido |
| Alfabeto respeitado | Com só "números" ativo, o resultado bate `/^[0-9]+$/` |
| Classificação correta | `"A_secure_123456"` com os 4 tipos é avaliada como "Forte" |
| Nenhuma opção ativa | Retorna string vazia em vez de quebrar |

O último caso merece atenção: ele testa uma proteção de segundo nível. A
interface já impede desligar a última opção pelo `toggleOption`, mas a função
também se defende sozinha, devolvendo `""` em vez de tentar sortear de um
alfabeto vazio. Isso mantém a lógica correta mesmo se alguém reaproveitar o
módulo em outra tela sem a mesma trava visual.

Note que os testes cobrem apenas `lib/password-generator.ts`. A interface em
`app/(tabs)/index.tsx` não tem testes — o que é coerente com a separação entre
lógica e apresentação: a parte que carrega as regras é justamente a que está
protegida.



## Iniciar o projeto

```
npm run start
```

Quando o servidor é iniciado, o projeto pode ser aberto em um emulador, em um dispositivo conectado ou no navegador, quando esse destino estiver habilitado. O comando específico depende dos scripts disponíveis no `package.json`.

| Destino | Comando anotado nos materiais | Observação |
|---|---|---|
| Android | `npm run android` | Requer emulador ou dispositivo Android configurado. |
| iOS | `npm run ios` | O material observa a necessidade de macOS para construir o projeto iOS. |
| Web | `npm run web` | Útil para uma primeira inspeção no navegador, quando suportado pelo projeto. |
| Servidor Expo | `expo start` ou `npm start` | Abre o fluxo de desenvolvimento do projeto. |

