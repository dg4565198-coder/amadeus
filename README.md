# 🌿 AMADEUS — Gestão e Manejo Rural Sustentável

**AMADEUS** (*Ambiente de Aprendizado e Desenvolvimento em SIPA na Bahia · Administração, Manejo e Apoio à Decisão em Empreendimentos e Unidades Rurais Sustentáveis*) é uma aplicação web progressiva (PWA) para gestão integrada de propriedades rurais e áreas experimentais (IF Baiano).

![Logo AMADEUS](assets/logo-amadeus.png)

## ✨ Funcionalidades Principais

1. **Controle Pluviométrico (2025 e 2026):** Série histórica oficial com 187 medições da Área Experimental, distinção entre `0 mm` e lacuna de dados (jan–abr/2025), acumulados, médias, comparativo temporal 2025 × 2026, gráficos interativos em tela cheia e exportação PDF/CSV.
2. **Gestão de Atividades Rurais:** Registro de serviços de campo, anexos, coordenadas GPS e vínculo automático com a carga horária da equipe.
3. **Agendamento, Notificações e Calculadora:** Cartões amarelos e verdes, lembretes 2h antes e calculadora rural integrada.
4. **Pessoas e Biometria (Agricultura e Pecuária):** Controle de horas trabalhadas, relatórios individuais em PDF e ponto biométrico (WebAuthn / SHA-256).
5. **Controle Zootécnico e GMD:** Histórico de pesagens, cálculo automático de $\text{GMD} = \frac{\text{peso final} - \text{peso inicial}}{\text{dias}}$ e emissão de fichas individuais em PDF.
6. **Anotações Privadas:** Isolamento criptográfico por autor, rascunho automático no celular e conversão em tarefa/atividade.
7. **Produção, Estoque e Financeiro:** Gestão de safras, insumos e fluxo de caixa rural.
8. **Portal Institucional:** Vitrine pública dos eixos de Pesquisa, Ensino, Extensão e Sustentabilidade.
9. **Administração, Firebase e GitHub:** Controle estrito de edição/exclusão exclusivo para Administradores, sincronização em tempo real com **Firebase** e backup/publicação via **GitHub**.

## 🚀 Como Executar

- **No Windows (Servidor Local):** Execute `iniciar_amadeus.bat` e acesse `http://localhost:8080`.
- **GitHub Pages / Firebase Hosting:** O projeto é 100% compatível com publicação estática PWA e sincronização em nuvem via Firebase.
