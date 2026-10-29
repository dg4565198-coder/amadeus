// ============================================================================
// AMADEUS - Base de Dados Inicial e Históricos Pluviométricos 2025 / 2026
// Administração, Manejo e Apoio à Decisão em Empreendimentos e Unidades Rurais Sustentáveis
// ============================================================================

const RAW_CSV_2025 = `"Data";"Milímetros";"Horário";"Pluviômetro";"Local";"Observação";"Responsável"
"2025-05-06";"4";"08:56";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-05-07";"0";"08:54";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-05-08";"15";"08:56";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Marcos Maciel";"Guilherme Dias Pereira"
"2025-05-09";"1.5";"08:26";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Cristina Vales";"Guilherme Dias Pereira"
"2025-05-13";"52";"09:40";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Valor informado como acumulado · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-05-14";"2.5";"12:47";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Marcos Maciel";"Guilherme Dias Pereira"
"2025-05-15";"2";"09:20";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-05-16";"28";"09:18";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-05-19";"2";"10:30";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-05-20";"2";"09:04";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-05-21";"2";"09:03";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-05-22";"0";"09:49";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-05-23";"0";"09:44";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-05-26";"1";"09:55";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Gustavo Nunes";"Guilherme Dias Pereira"
"2025-05-27";"1";"13:12";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Gustavo Nunes";"Guilherme Dias Pereira"
"2025-05-28";"0";"08:53";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-05-29";"12";"09:16";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-06-02";"4";"15:11";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-06-03";"8";"08:57";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Gustavo Nunes";"Guilherme Dias Pereira"
"2025-06-04";"12";"09:41";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Gustavo Nunes";"Guilherme Dias Pereira"
"2025-06-05";"0";"08:54";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-06-17";"0";"09:50";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-06-18";"2";"09:49";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Professor Charles Leonel";"Guilherme Dias Pereira"
"2025-06-25";"9";"09:26";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Kássio Mickael";"Guilherme Dias Pereira"
"2025-06-26";"12";"08:44";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-06-27";"2";"12:55";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-07-30";"2";"15:25";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-07-31";"1";"12:15";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-08-01";"0";"10:47";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-08-04";"10";"13:47";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-08-06";"1";"09:12";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-08-07";"0";"08:54";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-08-08";"0";"08:58";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-08-11";"0";"13:05";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-08-12";"6";"09:00";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Ferreira - 2º Agro";"Guilherme Dias Pereira"
"2025-08-13";"12";"09:00";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Ferreira - 2º Agro";"Guilherme Dias Pereira"
"2025-08-14";"2";"08:59";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Ferreira - 2º Agro";"Guilherme Dias Pereira"
"2025-08-15";"0";"09:04";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Ferreira - 2º Agro";"Guilherme Dias Pereira"
"2025-08-18";"0";"09:10";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-08-19";"0";"08:55";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-08-20";"0";"09:07";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-08-21";"0";"12:20";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-08-22";"0";"12:00";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-08-28";"0";"09:19";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-09-01";"0";"09:00";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-09-02";"5.5";"09:07";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-09-03";"5";"09:06";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-09-04";"0";"15:10";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-09-05";"0";"15:10";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-09-08";"0";"09:17";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-09-09";"0";"08:49";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-09-10";"0";"08:51";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Ferreira - 2º Agro";"Guilherme Dias Pereira"
"2025-09-11";"0";"08:50";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-09-12";"0";"09:03";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-09-17";"4";"08:58";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-09-18";"0";"09:13";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-09-19";"1";"09:00";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-09-20";"25";"08:37";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-09-23";"20";"10:26";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-09-24";"1";"08:51";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-09-25";"2";"11:23";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-09-30";"2";"10:02";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-10-01";"0";"11:07";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-10-02";"0";"09:38";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-10-03";"2.5";"08:58";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-10-08";"4";"08:52";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-10-09";"0";"09:00";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Ferreira - 2º Agro";"Guilherme Dias Pereira"
"2025-10-10";"1";"08:52";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-10-14";"0";"08:57";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-10-16";"0";"08:51";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Ferreira - 2º Agro";"Guilherme Dias Pereira"
"2025-10-17";"0";"09:02";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-10-20";"8";"09:04";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-10-21";"30";"08:58";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Ferreira - 2º Agro";"Guilherme Dias Pereira"
"2025-10-23";"13";"08:41";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Professor Charles Leonel";"Guilherme Dias Pereira"
"2025-10-24";"2";"08:55";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-10-25";"38";"08:58";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Ferreira - 2º Agro";"Guilherme Dias Pereira"
"2025-10-27";"5.5";"17:37";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-10-29";"0";"10:13";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-10-30";"0";"09:22";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-10-31";"0";"08:40";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Ferreira - 2º Agro";"Guilherme Dias Pereira"
"2025-11-01";"0";"09:52";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Ferreira - 2º Agro";"Guilherme Dias Pereira"
"2025-11-03";"0";"12:29";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Professor Charles Leonel";"Guilherme Dias Pereira"
"2025-11-04";"0";"08:31";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-11-05";"0";"09:12";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Samuel Teixeira";"Guilherme Dias Pereira"
"2025-11-06";"0";"12:01";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-11-07";"1";"08:54";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-11-10";"2";"10:52";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-11-11";"2";"12:01";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-11-12";"0";"19:19";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-11-14";"0";"09:20";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Luanna Alves - 2º Agro";"Guilherme Dias Pereira"
"2025-11-18";"0";"08:44";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Ferreira - 2º Agro";"Guilherme Dias Pereira"
"2025-11-19";"2";"09:06";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Samuel Teixeira";"Guilherme Dias Pereira"
"2025-11-24";"25";"09:13";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-11-25";"30";"10:31";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Samuel Teixeira";"Guilherme Dias Pereira"
"2025-11-26";"38";"08:52";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-11-27";"1";"08:45";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-11-28";"0";"08:50";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-11-29";"6";"14:04";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-12-02";"0";"08:44";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-12-03";"0";"09:09";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-12-04";"2";"09:18";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-12-05";"86";"17:37";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-12-07";"11";"09:43";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-12-08";"0";"09:58";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-12-09";"0";"17:03";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-12-10";"0";"10:04";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-12-12";"0";"09:02";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-12-26";"52";"09:03";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2025-12-29";"0";"09:36";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2025-12-30";"0";"09:18";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"`;

const RAW_CSV_2026 = `"Data";"Milímetros";"Horário";"Pluviômetro";"Local";"Observação";"Responsável"
"2026-01-02";"0";"09:32";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-01-05";"4";"09:11";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-01-09";"32";"09:37";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2026-01-14";"0";"13:14";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-01-15";"2";"11:34";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-01-16";"0";"12:11";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-01-23";"70";"07:45";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2026-01-30";"4";"13:06";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2026-02-02";"40";"10:05";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-02-03";"0";"10:10";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-02-04";"0";"10:06";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2026-02-05";"0";"09:02";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-02-06";"0";"10:06";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2026-02-07";"0";"18:11";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-02-10";"0";"09:10";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-02-12";"0";"12:12";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-02-13";"1";"19:00";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-02-19";"0";"17:10";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2026-02-20";"0";"21:55";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-02-23";"16";"21:23";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-02-25";"3";"12:35";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-02-27";"94";"22:50";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-02";"150";"09:22";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-03";"4";"12:01";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-04";"0";"09:19";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-05";"0";"14:15";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-06";"0";"13:24";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-10";"0";"21:26";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-11";"3";"10:53";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-12";"1";"09:04";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-13";"0";"16:09";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-16";"0";"20:02";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-17";"6";"10:32";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-18";"1";"09:24";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-19";"0";"12:25";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-20";"0";"20:31";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-23";"7";"17:44";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-24";"2";"09:46";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-25";"2";"18:59";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-27";"12";"04:11";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-03-30";"22";"20:02";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-04-06";"34";"09:29";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-04-07";"6";"11:52";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-04-09";"0";"17:15";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-04-13";"35";"11:15";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Isabely Neves";"Guilherme Dias Pereira"
"2026-04-14";"0";"18:42";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-04-15";"0";"17:18";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-04-17";"0";"15:12";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2026-04-22";"0";"12:04";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-04-23";"0";"13:23";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-04-27";"0";"11:24";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-04-28";"0";"10:58";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-04-30";"0";"18:18";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-04";"22";"09:17";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-05";"25";"07:45";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-08";"14";"09:36";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2026-05-11";"18";"11:27";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-12";"1";"12:47";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-13";"5";"09:01";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-14";"0";"08:37";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Alisson";"Guilherme Dias Pereira"
"2026-05-19";"4";"13:46";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-20";"0";"18:03";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-21";"0";"09:11";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-22";"14";"13:39";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-25";"32";"19:16";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-27";"2";"12:28";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-28";"8";"14:37";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-05-29";"3";"10:19";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Professor Charles Leonel";"Guilherme Dias Pereira"
"2026-06-01";"0";"20:40";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-06-02";"0";"12:35";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Felipe Zeca";"Guilherme Dias Pereira"
"2026-06-03";"0";"21:10";"Pluviômetro 1";"Área experimental";"Importado do histórico do WhatsApp · Registrado originalmente por Professor Charles Leonel";"Guilherme Dias Pereira"
"2026-08-20";"6";"07:00";"Pluviômetro 1";"Área experimental";"Zeca e Guilherme";"Guilherme Dias Pereira"
"2026-08-21";"0";"13:20";"Pluviômetro 1";"Área experimental IF Baiano";"Guilherme Dias";"Guilherme Dias Pereira"
"2026-08-22";"0";"09:30";"Pluviômetro 1";"Área experimental";"";"Guilherme Dias Pereira"
"2026-08-23";"0";"09:00";"Pluviômetro 1";"Área experimental";"";"Guilherme Dias Pereira"
"2026-08-24";"0";"08:30";"Pluviômetro 1";"Área experimental";"";"Guilherme Dias Pereira"
"2026-08-25";"0";"08:45";"Pluviômetro 1";"Área experimental";"";"Guilherme Dias Pereira"
"2026-08-26";"0";"09:00";"Pluviômetro 1";"Área experimental";"";"Guilherme Dias Pereira"
"2026-08-27";"0";"09:00";"Pluviômetro 1";"Área experimental";"";"Guilherme Dias Pereira"`;

function parseAmadeusCSV(csvText, prefix) {
  const lines = csvText.trim().split(/\r?\n/);
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = line.split(';').map((c) => c.replace(/^"|"$/g, '').trim());
    if (cols.length >= 7) {
      const mmVal = parseFloat(cols[1].replace(',', '.'));
      records.push({
        id: `${prefix}-${String(i).padStart(3, '0')}`,
        data: cols[0],
        mm: isNaN(mmVal) ? 0 : mmVal,
        horario: cols[2] || '08:00',
        pluviometro: cols[3] || 'Pluviômetro 1',
        local: cols[4] || 'Área experimental',
        observacao: cols[5] || '',
        responsavel: cols[6] || 'Guilherme Dias Pereira',
        origem: 'Importado Oficial CSV'
      });
    }
  }
  return records;
}

function getInitialDatabase() {
  const chuvas2025 = parseAmadeusCSV(RAW_CSV_2025, 'pluv2025');
  const chuvas2026 = parseAmadeusCSV(RAW_CSV_2026, 'pluv2026');

  return {
    versao: '2.0.0',
    atualizadoEm: new Date().toISOString(),
    configuracoes: {
      nomeSistema: 'AMADEUS',
      nomeExpandido: 'Ambiente de Aprendizado e Desenvolvimento em SIPA na Bahia · Administração, Manejo e Apoio à Decisão em Empreendimentos e Unidades Rurais Sustentáveis',
      subtitulo: 'Ambiente de Aprendizado e Desenvolvimento em SIPA na Bahia · IF Baiano',
      corPrimaria: '#166534',
      logoUrl: 'assets/logo-amadeus.png',
      bannerUrl: '',
      textoSobre: 'O AMADEUS é uma plataforma desenvolvida para centralizar registros da propriedade rural e áreas experimentais, reduzindo a dependência de anotações em papel e apoiando o ensino, a pesquisa, a extensão e a sustentabilidade no campo.',
      textoEnsino: 'Apoio às aulas práticas de Agropecuária, Zootecnia e Agronomia com dados reais de campo, séries históricas de precipitação e índices zootécnicos.',
      textoPesquisa: 'Coleta sistematizada de dados agrometeorológicos (Pluviômetro 1 — Área Experimental), ensaios produtivos e acompanhamento de Ganho Médio Diário (GMD) em rebanhos.',
      textoExtensao: 'Transferência de tecnologia para produtores rurais e unidades familiares sustentáveis através de relatórios transparentes e ferramentas digitais acessíveis via celular (PWA).',
      textoSustentabilidade: 'Manejo racional de recursos hídricos, conservação do solo, bem-estar animal e rastreabilidade completa das operações rurais.',
      instagram: '@amadeus.ifbaiano',
      emailContato: 'amadeus.rural@ifbaiano.edu.br',
      telefoneContato: '(77) 3491-0000',
      rodapeTexto: 'AMADEUS · Administração, Manejo e Apoio à Decisão em Empreendimentos e Unidades Rurais Sustentáveis · Área Experimental IF Baiano',
      chaveRestauracaoAdmin: 'AMADEUS-ADMIN-2026'
    },
    usuarios: [
      {
        id: 'usr-admin-1',
        nome: 'Guilherme Dias Pereira (Admin)',
        login: 'admin',
        aliasesLogin: ['guilherme', 'admim', 'admin@amadeus.org.br', 'guilherme@amadeus.rural'],
        email: 'guilherme@amadeus.rural',
        senhaHash: '123',
        senha: '123',
        perfil: 'admin',
        statusAcesso: 'aprovado',
        cargo: 'Administrador Geral / Responsável Técnico',
        ativo: true,
        permissoes: ['tudo', 'exportar', 'admin', 'portal', 'backup']
      },
      {
        id: 'usr-prof-1',
        nome: 'Professor Charles Leonel',
        login: 'charles',
        email: 'charles.leonel@ifbaiano.edu.br',
        senhaHash: '123',
        senha: '123',
        perfil: 'admin',
        statusAcesso: 'aprovado',
        cargo: 'Docente e Coordenador de Pesquisa',
        ativo: true,
        permissoes: ['tudo', 'exportar', 'admin', 'portal']
      },
      {
        id: 'usr-colab-1',
        nome: 'Felipe Zeca (Colaborador)',
        login: 'colaborador',
        aliasesLogin: ['zeca', 'colaborador@amadeus.org.br'],
        email: 'zeca@amadeus.rural',
        senhaHash: '123',
        senha: '123',
        perfil: 'colaborador',
        statusAcesso: 'aprovado',
        cargo: 'Colaborador de Campo e Monitoramento',
        ativo: true,
        permissoes: ['consultar', 'registrar', 'exportar']
      },
      {
        id: 'usr-colab-2',
        nome: 'Alisson (Colaborador)',
        login: 'alisson',
        email: 'alisson@amadeus.rural',
        senhaHash: '123',
        senha: '123',
        perfil: 'colaborador',
        statusAcesso: 'aprovado',
        cargo: 'Colaborador de Manejo Rural',
        ativo: true,
        permissoes: ['consultar', 'registrar', 'exportar']
      },
      {
        id: 'usr-leitor-1',
        nome: 'Visitante / Consulta Técnica (Leitor)',
        login: 'leitor',
        aliasesLogin: ['leitor@amadeus.org.br'],
        email: 'leitor@amadeus.rural',
        senhaHash: '123',
        senha: '123',
        perfil: 'leitor',
        statusAcesso: 'aprovado',
        cargo: 'Leitor / Consulta de Relatórios',
        ativo: true,
        permissoes: ['consultar', 'exportar']
      }
    ],
    pessoas: [
      {
        id: 'pes-02',
        nome: 'Felipe Zeca',
        funcao: 'Técnico / Monitor de Campo',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Colaborador Efetivo',
        documento: 'MAT-2025002',
        telefone: '(77) 99900-0002',
        biometriaCadastrada: true,
        biometriaId: 'BIO-ZECA-SHA256-4C2E',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 0,
        observacoes: 'Principal participante das aferições diárias, irrigação do milho e manejo das novilhas na Unidade Experimental (40,5 h no período).'
      },
      {
        id: 'pes-03',
        nome: 'Alisson',
        funcao: 'Auxiliar de Manejo Agropecuário',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Colaborador',
        documento: 'MAT-2025003',
        telefone: '(77) 99900-0003',
        biometriaCadastrada: true,
        biometriaId: 'BIO-ALISSON-SHA256-7D1B',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 0,
        observacoes: 'Atua nas aferições pluviométricas, irrigação e coleta de dados do milho e manejo animal (26 h no período).'
      },
      {
        id: 'pes-11',
        nome: 'Luanna Alves',
        funcao: 'Estudante / Monitora de Agropecuária',
        setor: 'Agricultura',
        vinculo: 'Discente 2º Ano Agro',
        documento: 'DIS-2025111',
        telefone: '',
        biometriaCadastrada: true,
        biometriaId: 'BIO-LUANNA-SHA256-6A1C',
        biometriaModalidade: 'Agricultura',
        horasBase: 0,
        observacoes: 'Monitoramento na Unidade Experimental, irrigação e coleta de dados do milho (7,5 h no período).'
      },
      {
        id: 'pes-04',
        nome: 'Prof.Dr Charles Leonel',
        funcao: 'Docente / Orientador Técnico',
        setor: 'Pesquisa e Ensino',
        vinculo: 'Servidor Docente',
        documento: 'SIAPE-102938',
        telefone: '(77) 99900-0004',
        biometriaCadastrada: true,
        biometriaId: 'BIO-CHARLES-SHA256-1A5F',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 0,
        observacoes: 'Supervisão acadêmica e validação de experimentos na Unidade Experimental (7 h no período).'
      },
      {
        id: 'pes-13',
        nome: 'Arthur Aguiar',
        funcao: 'Colaborador / Discente de Campo',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Discente / Equipe SIPA',
        documento: 'DIS-2026013',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 0,
        observacoes: 'Participação em mutirões de limpeza, roçagem, reparos de cerca e realocação de animais (6 h no período).'
      },
      {
        id: 'pes-14',
        nome: 'Thiago Salvino',
        funcao: 'Colaborador / Discente de Campo',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Discente / Equipe SIPA',
        documento: 'DIS-2026014',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 0,
        observacoes: 'Participação em atividades de roçagem, checklist diário e manejo de piquetes (6 h no período).'
      },
      {
        id: 'pes-15',
        nome: 'Pedro Paulo',
        funcao: 'Colaborador / Discente de Campo',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Discente / Equipe SIPA',
        documento: 'DIS-2026015',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 0,
        observacoes: 'Apoio em coleta de dados do milho, reparo de cerca elétrica e roçagem (5,5 h no período).'
      },
      {
        id: 'pes-05',
        nome: 'Ferreira',
        funcao: 'Estudante / Monitor de Agropecuária',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Discente 2º Ano Agro',
        documento: 'DIS-2025105',
        telefone: '',
        biometriaCadastrada: true,
        biometriaId: 'BIO-FERREIRA-SHA256-3E9C',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 0,
        observacoes: 'Participação em pesagens de animais, coleta de dados do milho e manejo sanitário (5,5 h no período).'
      },
      {
        id: 'pes-16',
        nome: 'Felipe Cruz',
        funcao: 'Colaborador / Discente de Campo',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Discente / Equipe SIPA',
        documento: 'DIS-2026016',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 0,
        observacoes: 'Aferições pluviométricas, desmontagem de irrigação e manejo de piquetes (5 h no período).'
      },
      {
        id: 'pes-17',
        nome: 'Mateus Dimas',
        funcao: 'Colaborador / Discente de Campo',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Discente / Equipe SIPA',
        documento: 'DIS-2026017',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 0,
        observacoes: 'Participação em pesagens zootécnicas, coleta de dados do milho e aferições (5 h no período).'
      },
      {
        id: 'pes-18',
        nome: 'Abraão',
        funcao: 'Colaborador / Discente de Campo',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Discente / Equipe SIPA',
        documento: 'DIS-2026018',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 0,
        observacoes: 'Participação no mutirão de limpeza, roçagem alta nos piquetes 1 e 2 e manutenção (4,5 h no período).'
      },
      {
        id: 'pes-19',
        nome: 'Luana Avelar',
        funcao: 'Colaboradora / Discente de Campo',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Discente / Equipe SIPA',
        documento: 'DIS-2026019',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 0,
        observacoes: 'Participação na pesagem de animais e organização do sistema de irrigação (2,5 h no período).'
      },
      {
        id: 'pes-08',
        nome: 'Gustavo',
        funcao: 'Colaborador de Campo',
        setor: 'Pecuária',
        vinculo: 'Colaborador / Equipe SIPA',
        documento: 'COL-2025108',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Pecuária',
        horasBase: 0,
        observacoes: 'Participação na aferição e pesagem dos animais do experimento (2 h no período).'
      },
      {
        id: 'pes-20',
        nome: 'Prof .Dr Jobson Pimentel',
        funcao: 'Docente / Pesquisador',
        setor: 'Pesquisa e Ensino',
        vinculo: 'Servidor Docente',
        documento: 'SIAPE-202620',
        telefone: '',
        biometriaCadastrada: true,
        biometriaId: 'BIO-JOBSON-SHA256-5D4E',
        biometriaModalidade: 'Pecuária',
        horasBase: 0,
        observacoes: 'Supervisão e acompanhamento de pesagem dos animais do experimento (2 h no período).'
      },
      {
        id: 'pes-21',
        nome: 'Mateus Brunelli',
        funcao: 'Colaborador / Discente de Campo',
        setor: 'Pecuária',
        vinculo: 'Discente / Equipe SIPA',
        documento: 'DIS-2026021',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Pecuária',
        horasBase: 0,
        observacoes: 'Participação na pesagem dos animais e irrigação do milho em fevereiro de 2026 (1 h no período).'
      },
      {
        id: 'pes-22',
        nome: 'Kécya Págio',
        funcao: 'Colaboradora / Discente de Campo',
        setor: 'Pecuária',
        vinculo: 'Discente / Equipe SIPA',
        documento: 'DIS-2026022',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Pecuária',
        horasBase: 0,
        observacoes: 'Participação na aferição e realocação das novilhas para o piquete 1 (0,5 h no período).'
      },
      {
        id: 'pes-12',
        nome: 'Isabely Neves',
        funcao: 'Bolsista / Monitora',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Discente',
        documento: 'DIS-2026112',
        telefone: '',
        biometriaCadastrada: true,
        biometriaId: 'BIO-ISABELY-SHA256-8B2A',
        biometriaModalidade: 'Agricultura',
        horasBase: 0,
        observacoes: 'Participação na aferição e realocação das novilhas na Unidade Experimental (0,5 h no período).'
      },
      {
        id: 'pes-06',
        nome: 'Samuel Teixeira',
        funcao: 'Colaborador / Monitor',
        setor: 'Agricultura',
        vinculo: 'Discente / Bolsista',
        documento: 'DIS-2025106',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura',
        horasBase: 0,
        observacoes: 'Organização e ajustes para instalação do sistema de irrigação (0,5 h no período).'
      },
      {
        id: 'pes-23',
        nome: 'Samuel',
        funcao: 'Colaborador de Campo',
        setor: 'Agricultura',
        vinculo: 'Discente / Equipe SIPA',
        documento: 'DIS-2026023',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura',
        horasBase: 0,
        observacoes: 'Adubação foliar no milho — Nutri C + Radicel (0,5 h no período).'
      },
      {
        id: 'pes-01',
        nome: 'Guilherme Dias Pereira',
        funcao: 'Coordenador / Gestor do Sistema (Responsável pelos Registros)',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Responsável Técnico',
        documento: 'MAT-2025001',
        telefone: '(77) 99900-0001',
        biometriaCadastrada: true,
        biometriaId: 'BIO-GUILHERME-SHA256-9F8A',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 0,
        observacoes: 'Responsável pela emissão e registro das 43 atividades (48 h) e consolidação pluviométrica no AMADEUS.'
      }
    ],
    registrosBiometricos: [
      {
        id: 'regbio-01',
        pessoaId: 'pes-02',
        pessoaNome: 'Felipe Zeca',
        setor: 'Agricultura',
        tipo: 'Entrada / Aferição Pluviométrica e Manejo',
        dataHora: '2026-03-31T08:00:00',
        local: 'IF Baino Unidade Experimental',
        hashAssinatura: 'BIO-ZECA-SHA256-4C2E-VERIFIED',
        metodo: 'Biometria validada'
      },
      {
        id: 'regbio-02',
        pessoaId: 'pes-01',
        pessoaNome: 'Guilherme Dias Pereira',
        setor: 'Pecuária',
        tipo: 'Coordenação e Emissão do Diário de Campo',
        dataHora: '2026-03-31T14:20:00',
        local: 'IF Baino Unidade Experimental',
        hashAssinatura: 'BIO-GUILHERME-SHA256-9F8A-VERIFIED',
        metodo: 'Biometria validada'
      }
    ],
    atividades: [
      {
        id: 'atv-pdf-01',
        titulo: 'Aferição e realocação dos animais',
        categoria: 'Pecuária',
        data: '2026-03-31',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Realocação das novilhas para o piquete 2 - Aferição da cerca elétrica - 9/10KV',
        anexos: []
      },
      {
        id: 'atv-pdf-02',
        titulo: 'Aferições',
        categoria: 'Pesquisa',
        data: '2026-03-30',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-16', 'pes-17'],
        responsaveisNomes: ['Alisson', 'Felipe Cruz', 'Mateus Dimas'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 22 mm - Aferição da cerca elétrica - 9/10KV',
        anexos: []
      },
      {
        id: 'atv-pdf-03',
        titulo: 'Aferições limpeza,rocagem e atividades diárias',
        categoria: 'Manutenção',
        data: '2026-03-27',
        horaInicio: '07:30',
        horaFim: '12:00',
        horasTrabalhadas: 4.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-18', 'pes-03', 'pes-13', 'pes-04', 'pes-16', 'pes-15', 'pes-14'],
        responsaveisNomes: ['Abraão', 'Alisson', 'Arthur Aguiar', 'Prof.Dr Charles Leonel', 'Felipe Cruz', 'Pedro Paulo', 'Thiago Salvino'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 12 mm - Aferição da cerca elétrica - 9,5/13KV - Reparo na cerca elétrica - Desmontagem do Sistema de Irrigação - Novilhas realocadas ao piquete pulmão (campo agrostológico) - 300g de Sal Mineral - Limpeza dos bebedouros - Roçada alta nos piquetes 1 e 2',
        anexos: []
      },
      {
        id: 'atv-pdf-04',
        titulo: 'Aferições',
        categoria: 'Pesquisa',
        data: '2026-03-25',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 2 mm - Aferição da cerca elétrica - 10 KV',
        anexos: []
      },
      {
        id: 'atv-pdf-05',
        titulo: 'Aferição e realocação dos animais',
        categoria: 'Pecuária',
        data: '2026-03-24',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02', 'pes-22', 'pes-12'],
        responsaveisNomes: ['Felipe Zeca', 'Kécya Págio', 'Isabely Neves'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 2 mm - Aferição da cerca elétrica - 10 KV - Novilhas realocados ao piquete 1',
        anexos: []
      },
      {
        id: 'atv-pdf-06',
        titulo: 'Aferições',
        categoria: 'Pesquisa',
        data: '2026-03-23',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 7 mm - Aferição da cerca elétrica - 9,5/11,5KV',
        anexos: []
      },
      {
        id: 'atv-pdf-07',
        titulo: 'Aferições ,realocação ,sal mineral e limpeza do bebedouro',
        categoria: 'Pecuária',
        data: '2026-03-20',
        horaInicio: '08:00',
        horaFim: '09:30',
        horasTrabalhadas: 1.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 0 mm - Aferição da cerca elétrica - 12KV - Limpeza do bebedouro da unidade demonstrativa - 300g de Sal mineral no cocho - Novilhas realocadas ao piquete 2',
        anexos: []
      },
      {
        id: 'atv-pdf-08',
        titulo: 'Aferições',
        categoria: 'Pesquisa',
        data: '2026-03-19',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 0 mm - Aferição da cerca elétrica - 11,7KV-9,5KV',
        anexos: []
      },
      {
        id: 'atv-pdf-09',
        titulo: 'Aferições',
        categoria: 'Pesquisa',
        data: '2026-03-18',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 1 mm - Aferição da cerca elétrica - 9,8KV',
        anexos: []
      },
      {
        id: 'atv-pdf-10',
        titulo: 'Aferições e sal mineral',
        categoria: 'Pecuária',
        data: '2026-03-17',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 6 mm - 300g de Sal mineral no cocho - Aferição da cerca elétrica - 10KV',
        anexos: []
      },
      {
        id: 'atv-pdf-11',
        titulo: 'Aferição e realocação',
        categoria: 'Pecuária',
        data: '2026-03-16',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 0 mm - Novilhas realocadas ao piquete 1',
        anexos: []
      },
      {
        id: 'atv-pdf-12',
        titulo: 'Aferição ,realocação dos animais e checkilist diários.',
        categoria: 'Pecuária',
        data: '2026-03-13',
        horaInicio: '08:00',
        horaFim: '09:30',
        horasTrabalhadas: 1.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-13', 'pes-04', 'pes-02', 'pes-17', 'pes-14'],
        responsaveisNomes: ['Alisson', 'Arthur Aguiar', 'Prof.Dr Charles Leonel', 'Felipe Zeca', 'Mateus Dimas', 'Thiago Salvino'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 0 mm - Novilhas realocadas para o piquete 2 - Reparo na cerca elétrica - Limpeza do bebedouro',
        anexos: []
      },
      {
        id: 'atv-pdf-13',
        titulo: 'Aferição',
        categoria: 'Pesquisa',
        data: '2026-03-12',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 1 mm',
        anexos: []
      },
      {
        id: 'atv-pdf-14',
        titulo: 'Aferição e pesagem dos Animais',
        categoria: 'Pecuária',
        data: '2026-03-11',
        horaInicio: '08:00',
        horaFim: '10:00',
        horasTrabalhadas: 2,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02', 'pes-05', 'pes-08', 'pes-19', 'pes-20', 'pes-17'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca', 'Ferreira', 'Gustavo', 'Luana Avelar', 'Prof .Dr Jobson Pimentel', 'Mateus Dimas'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Pesagem dos animais. - Aferição do Pluviômetro na área do experimento - 3 mm. *Bianca* Fita: 385Kg Balança: 347Kg *Boreal* Fita: 449Kg Balança: 425Kg *Bruna* Fita: 310Kg Balança: 259Kg',
        anexos: []
      },
      {
        id: 'atv-pdf-15',
        titulo: 'Aferição ,irrigação ,sal mineral e realocação',
        categoria: 'Agricultura',
        data: '2026-03-10',
        horaInicio: '08:00',
        horaFim: '10:30',
        horasTrabalhadas: 2.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 0 mm - 300g de Sal mineral no cocho - Irrigação do milho (2h) - Novilhas realocadas para o piquete 1',
        anexos: []
      },
      {
        id: 'atv-pdf-16',
        titulo: 'Aferição ,irrigação e chechilist diário .',
        categoria: 'Pecuária',
        data: '2026-03-06',
        horaInicio: '08:00',
        horaFim: '11:00',
        horasTrabalhadas: 3,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 00 mm - Aplicação de Lepecid em uma das novilhas do experimento (Boreal) - 300g de Sal mineral no cocho - Irrigação do milho (2h) - limpeza do bebedouro',
        anexos: []
      },
      {
        id: 'atv-pdf-17',
        titulo: 'Aferição',
        categoria: 'Pesquisa',
        data: '2026-03-05',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 0 mm',
        anexos: []
      },
      {
        id: 'atv-pdf-18',
        titulo: 'Aferição ,sal mineral e aplicação de Lepecid',
        categoria: 'Pecuária',
        data: '2026-03-04',
        horaInicio: '08:00',
        horaFim: '09:00',
        horasTrabalhadas: 1,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02', 'pes-05'],
        responsaveisNomes: ['Felipe Zeca', 'Ferreira'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 00 mm - Aplicação de Lepecid em uma das novilhas do experimento (Boreal) - 300g de Sal mineral no cocho',
        anexos: []
      },
      {
        id: 'atv-pdf-19',
        titulo: 'Aferição e Realocação de Animais',
        categoria: 'Pecuária',
        data: '2026-03-03',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 4 mm - Novilhas realocadas para o piquete 2',
        anexos: []
      },
      {
        id: 'atv-pdf-20',
        titulo: 'Aferição e Sal Mineral',
        categoria: 'Pecuária',
        data: '2026-03-02',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02', 'pes-11', 'pes-05'],
        responsaveisNomes: ['Felipe Zeca', 'Luanna Alves', 'Ferreira'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 150 mm - 300g de sal mineral',
        anexos: []
      },
      {
        id: 'atv-pdf-21',
        titulo: 'Aferição ,coleta de dados e reparo',
        categoria: 'Pesquisa',
        data: '2026-02-27',
        horaInicio: '08:00',
        horaFim: '09:00',
        horasTrabalhadas: 1,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02', 'pes-17', 'pes-15'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca', 'Mateus Dimas', 'Pedro Paulo'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 94mm - Coleta de dados do milho - Reparo na cerca elétrica',
        anexos: []
      },
      {
        id: 'atv-pdf-22',
        titulo: 'Aferição,irrigação e checklist diário.',
        categoria: 'Manutenção',
        data: '2026-02-25',
        horaInicio: '08:00',
        horaFim: '09:30',
        horasTrabalhadas: 1.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 3 mm - Irrigação do milho (30min) - Apenas para teste - Reparo do último aspersor da linha de irrigação - 150g de sal mineral no cocho - Reparo da cerca - Checklist da cerca - Ok - Novilhas realocadas para o piquete 1',
        anexos: []
      },
      {
        id: 'atv-pdf-23',
        titulo: 'Aferição - Irrigação - Sal mineral',
        categoria: 'Agricultura',
        data: '2026-02-23',
        horaInicio: '08:00',
        horaFim: '10:30',
        horasTrabalhadas: 2.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 16 mm - Irrigação do milho (2h) - 300g de sal mineral no cocho',
        anexos: []
      },
      {
        id: 'atv-pdf-24',
        titulo: 'Aferição ,irrigação ,Coleta de dados limpeza do bebedouro e roçagem',
        categoria: 'Agricultura',
        data: '2026-02-20',
        horaInicio: '08:00',
        horaFim: '11:00',
        horasTrabalhadas: 3,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02', 'pes-11'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca', 'Luanna Alves'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 0 mm - Irrigação do milho (2h) - Coleta de dados do milho - Limpeza do bebedouro (área experimental) - Roçagem e limpeza do corredor',
        anexos: []
      },
      {
        id: 'atv-pdf-25',
        titulo: "Aferição do Pluviômetro . - Reparo no vazamento da caixa d'água . - Novilhas realocadas .",
        categoria: 'Manutenção',
        data: '2026-02-19',
        horaInicio: '08:00',
        horaFim: '09:00',
        horasTrabalhadas: 1,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02', 'pes-04'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca', 'Prof.Dr Charles Leonel'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: "Aferição do pluviômetro na área do experimento - 0 mm. - Reparo no vazamento da caixa d'água . - Novilhas realocadas para o piquete 2.",
        anexos: []
      },
      {
        id: 'atv-pdf-26',
        titulo: 'Aferição do Pluviômetro - Irrigação do milho - Coleta dados do milho - Limpeza dos bebedouros',
        categoria: 'Agricultura',
        data: '2026-02-13',
        horaInicio: '08:00',
        horaFim: '11:00',
        horasTrabalhadas: 3,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02', 'pes-11'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca', 'Luanna Alves'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 1 mm - Irrigação do milho (2h) - Coleta de dados do milho - Limpeza dos bebedouros',
        anexos: []
      },
      {
        id: 'atv-pdf-27',
        titulo: 'Aferição do Pluviômetro - Irrigação do milho',
        categoria: 'Agricultura',
        data: '2026-02-12',
        horaInicio: '08:00',
        horaFim: '09:00',
        horasTrabalhadas: 1,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02', 'pes-11'],
        responsaveisNomes: ['Felipe Zeca', 'Luanna Alves'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 0 mm - Irrigação do milho (1h)',
        anexos: []
      },
      {
        id: 'atv-pdf-28',
        titulo: 'Aferição do Pluviômetro - Irrigação do milho - Novilhas realocadas - Sal mineral',
        categoria: 'Agricultura',
        data: '2026-02-10',
        horaInicio: '08:00',
        horaFim: '09:00',
        horasTrabalhadas: 1,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 0 mm - Irrigação do milho (1h) - Novilhas realocadas para o piquete 1 - 300g de sal mineral',
        anexos: []
      },
      {
        id: 'atv-pdf-29',
        titulo: 'Aferição do Pluviômetro - irrigação do milho',
        categoria: 'Agricultura',
        data: '2026-02-07',
        horaInicio: '08:00',
        horaFim: '09:00',
        horasTrabalhadas: 1,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 0 mm - irrigação do milho (1h)',
        anexos: []
      },
      {
        id: 'atv-pdf-30',
        titulo: 'Coleta de dados do milho - Aferição do Pluviômetro - Irrigação do milho',
        categoria: 'Pesquisa',
        data: '2026-02-06',
        horaInicio: '08:00',
        horaFim: '09:30',
        horasTrabalhadas: 1.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03'],
        responsaveisNomes: ['Alisson'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Coleta de dados do milho. - Aferição do pluviômetro na área do experimento - 0 mm. - Irrigação do milho (1h).',
        anexos: []
      },
      {
        id: 'atv-pdf-31',
        titulo: 'Aferição do Pluviômetro - irrigação do milho',
        categoria: 'Agricultura',
        data: '2026-02-05',
        horaInicio: '08:00',
        horaFim: '09:30',
        horasTrabalhadas: 1.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 0 mm - irrigação do milho (1h) *Obs:* - Novilhas realocadas para o piquete 2',
        anexos: []
      },
      {
        id: 'atv-pdf-32',
        titulo: 'Pesagem dos animais. - Irrigação do milho . - Aferição do Pluviômetro',
        categoria: 'Pecuária',
        data: '2026-02-04',
        horaInicio: '08:00',
        horaFim: '09:00',
        horasTrabalhadas: 1,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02', 'pes-05', 'pes-03', 'pes-21'],
        responsaveisNomes: ['Felipe Zeca', 'Ferreira', 'Alisson', 'Mateus Brunelli'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Pesagem dos animais. - Irrigação do milho (1h). - Aferição do Pluviômetro na área do experimento - 0 mm. *Bianca* Fita: 379 Kg Balança: 356 Kg *Boreal* Fita: 441 Kg Balança: 424 Kg *Bruna* Fita: 299 Kg Balança: 254 Kg *Bruto* Fita: 242 Kg Balança: 216 Kg',
        anexos: []
      },
      {
        id: 'atv-pdf-33',
        titulo: 'Aferição do Pluviômetro - Irrigação do milho',
        categoria: 'Manutenção',
        data: '2026-02-03',
        horaInicio: '08:00',
        horaFim: '09:00',
        horasTrabalhadas: 1,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: "Aferição do Pluviômetro na área do experimento - 0 mm - Irrigação do milho (1h) Obs.: Foi identificado que a cerca dos piquetes 1 e 2 não está transmitindo choque elétrico. - Além disso, foi detectado um vazamento no tampão da caixa d'água do sistema de irrigação, o que pode afetar a eficiência da irrigação e desperdiçar água.",
        anexos: []
      },
      {
        id: 'atv-pdf-34',
        titulo: 'Aferição do Pluviômetro',
        categoria: 'Pecuária',
        data: '2026-02-02',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Aferição do Pluviômetro na área do experimento - 40 mm Obs: - Animais transferidos para o curral, a fim de tratar uma “bicheira” no bezerro (Bruto).',
        anexos: []
      },
      {
        id: 'atv-pdf-35',
        titulo: 'Coleta de dados do milho. - Aferição do Pluviômetro - Novilhas realocadas. - Limpeza dos Bebedouros.',
        categoria: 'Pesquisa',
        data: '2026-01-30',
        horaInicio: '08:00',
        horaFim: '09:00',
        horasTrabalhadas: 1,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-05'],
        responsaveisNomes: ['Alisson', 'Ferreira'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Coleta de dados do milho. - Aferição do pluviômetro na área do experimento - 4 mm. - Novilhas realocadas para o piquete 1. - Limpeza dos bebedouros.',
        anexos: []
      },
      {
        id: 'atv-pdf-36',
        titulo: 'Coleta de dados do milho - Aferição do Pluviômetro',
        categoria: 'Pesquisa',
        data: '2026-01-23',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Coleta de dados do milho. - Aferição do Pluviômetro na área do experimento - 70 mm',
        anexos: []
      },
      {
        id: 'atv-pdf-37',
        titulo: 'Instalação sistema irrigação e Aferição Pluviômetro',
        categoria: 'Manutenção',
        data: '2026-01-16',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Instalação do sistema de irrigação na área do experimento (concluída) - Aferição do Pluviômetro na área do experimento - 0 mm',
        anexos: []
      },
      {
        id: 'atv-pdf-38',
        titulo: 'Instalação sistema irrigação e Aferição Pluviômetro',
        categoria: 'Manutenção',
        data: '2026-01-16',
        horaInicio: '14:00',
        horaFim: '14:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Instalação do sistema de irrigação na área do experimento (concluída) - Aferição do Pluviômetro na área do experimento - 0 mm',
        anexos: []
      },
      {
        id: 'atv-pdf-39',
        titulo: 'Organização e ajustes ,Aferição do Pluviômetro e Sal Mineral',
        categoria: 'Manutenção',
        data: '2026-01-15',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-02'],
        responsaveisNomes: ['Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: '- Organização e ajustes para instalação do sistema de irrigação na área do experimento - Aferição do Pluviômetro na área do experimento - 2 mm - 300g de Sal Mineral no cocho',
        anexos: []
      },
      {
        id: 'atv-pdf-40',
        titulo: 'Organização e ajustes para Irrigação - Aferição do Pluviômetro',
        categoria: 'Manutenção',
        data: '2026-01-14',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02', 'pes-19', 'pes-06'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca', 'Luana Avelar', 'Samuel Teixeira'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Organização e ajustes para instalação do sistema de irrigação na área do experimento - Aferição do Pluviômetro na área do experimento - 0 mm',
        anexos: []
      },
      {
        id: 'atv-pdf-41',
        titulo: 'Coleta de dados do milho. - Aferição do Pluviômetro',
        categoria: 'Pesquisa',
        data: '2026-01-09',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Coleta de dados do milho. - Aferição do Pluviômetro na área do experimento - 32 mm.',
        anexos: []
      },
      {
        id: 'atv-pdf-42',
        titulo: 'Adubação foliar no milho',
        categoria: 'Agricultura',
        data: '2026-01-05',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-23', 'pes-02'],
        responsaveisNomes: ['Samuel', 'Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'Adubação foliar no milho - Nutri C (14g) + Radicel (13ml)',
        anexos: []
      },
      {
        id: 'atv-pdf-43',
        titulo: 'Coleta de dados Milhoe e Realocação das novilhas )',
        categoria: 'Pesquisa',
        data: '2026-01-02',
        horaInicio: '08:00',
        horaFim: '08:30',
        horasTrabalhadas: 0.5,
        local: 'IF Baino Unidade Experimental',
        status: 'Concluída',
        responsaveisIds: ['pes-03', 'pes-02'],
        responsaveisNomes: ['Alisson', 'Felipe Zeca'],
        registradoPor: 'Guilherme Dias Pereira',
        descricao: 'ATIVIDADE REALIZADA: Coleta de dados do milho - Realocação das novilhas para o piquete CA (Campo agrostológico) - Aferição do pluviômetro (0mm)',
        anexos: []
      }
    ],
    agendamentos: [
      {
        id: 'agd-01',
        titulo: 'Aferição Pluviométrica Matinal e Checklist da Cerca Elétrica',
        data: '2026-10-30',
        horario: '08:00',
        local: 'IF Baino Unidade Experimental',
        responsavel: 'Felipe Zeca',
        corCartao: 'amarelo',
        status: 'Agendada',
        notificadoCadastro: true,
        lembrete2hEnviado: false,
        observacoes: 'Conferir Pluviômetro na área do experimento e voltagem da cerca elétrica (piquetes 1 e 2).'
      },
      {
        id: 'agd-02',
        titulo: 'Pesagem das Novilhas (Bianca, Boreal, Bruna) e Suplementação Mineral',
        data: '2026-11-04',
        horario: '08:30',
        local: 'IF Baino Unidade Experimental',
        responsavel: 'Guilherme Dias Pereira',
        corCartao: 'verde',
        status: 'Confirmada',
        notificadoCadastro: true,
        lembrete2hEnviado: false,
        observacoes: 'Registrar peso de fita e balança e fornecer 300g de sal mineral no cocho.'
      }
    ],
    animais: [
      {
        id: 'ani-01',
        brinco: 'EXP-01',
        nome: 'Boreal',
        especie: 'Bovino',
        raca: 'Novilha Experimento SIPA',
        sexo: 'Fêmea',
        dataNascimento: '2024-06-10',
        lote: 'Piquetes 1 e 2 · Unidade Experimental',
        status: 'Ativo',
        observacoes: 'Novilha do experimento na Unidade Experimental IF Baiano. Aplicado Lepecid em 04/03 e 06/03/2026.',
        pesagens: [
          { id: 'p-bor-1', data: '2026-02-04', peso: 424.0, observacao: 'Balança: 424 Kg | Fita: 441 Kg (Experimento SIPA)' },
          { id: 'p-bor-2', data: '2026-03-11', peso: 425.0, observacao: 'Balança: 425 Kg | Fita: 449 Kg (Experimento SIPA)' }
        ]
      },
      {
        id: 'ani-02',
        brinco: 'EXP-02',
        nome: 'Bianca',
        especie: 'Bovino',
        raca: 'Novilha Experimento SIPA',
        sexo: 'Fêmea',
        dataNascimento: '2024-07-15',
        lote: 'Piquetes 1 e 2 · Unidade Experimental',
        status: 'Ativo',
        observacoes: 'Novilha do experimento na Unidade Experimental IF Baiano (rotação entre Piquetes 1, 2 e Piquete Pulmão CA).',
        pesagens: [
          { id: 'p-bia-1', data: '2026-02-04', peso: 356.0, observacao: 'Balança: 356 Kg | Fita: 379 Kg (Experimento SIPA)' },
          { id: 'p-bia-2', data: '2026-03-11', peso: 347.0, observacao: 'Balança: 347 Kg | Fita: 385 Kg (Experimento SIPA)' }
        ]
      },
      {
        id: 'ani-03',
        brinco: 'EXP-03',
        nome: 'Bruna',
        especie: 'Bovino',
        raca: 'Novilha Experimento SIPA',
        sexo: 'Fêmea',
        dataNascimento: '2024-09-20',
        lote: 'Piquetes 1 e 2 · Unidade Experimental',
        status: 'Ativo',
        observacoes: 'Novilha do experimento na Unidade Experimental IF Baiano.',
        pesagens: [
          { id: 'p-bru-1', data: '2026-02-04', peso: 254.0, observacao: 'Balança: 254 Kg | Fita: 299 Kg (Experimento SIPA)' },
          { id: 'p-bru-2', data: '2026-03-11', peso: 259.0, observacao: 'Balança: 259 Kg | Fita: 310 Kg (Experimento SIPA)' }
        ]
      },
      {
        id: 'ani-04',
        brinco: 'EXP-04',
        nome: 'Bruto',
        especie: 'Bovino',
        raca: 'Bezerro Experimento SIPA',
        sexo: 'Macho',
        dataNascimento: '2025-05-10',
        lote: 'Unidade Experimental / Curral',
        status: 'Ativo',
        observacoes: 'Bezerro monitorado no experimento; transferido ao curral em 02/02/2026 para tratamento sanitário.',
        pesagens: [
          { id: 'p-brt-1', data: '2026-02-04', peso: 216.0, observacao: 'Balança: 216 Kg | Fita: 242 Kg (Experimento SIPA)' }
        ]
      }
    ],
    chuvas: [...chuvas2025, ...chuvas2026],
    anotacoes: [
      {
        id: 'not-01',
        titulo: 'Conferência da lacuna pluviométrica de início de 2025',
        categoria: 'Pesquisa',
        conteudo: 'Os registros importados de 2025 iniciam em 06/05/2025. Entre janeiro e abril de 2025 houve ausência de registro formal no histórico do WhatsApp — importante manter o alerta no painel para que a ausência de medição nunca seja confundida com 0 mm de chuva.',
        fixada: true,
        privada: false,
        autorId: 'usr-admin-1',
        autorNome: 'Guilherme Dias Pereira',
        localizacao: 'Área experimental IF Baiano',
        dataCriacao: '2026-08-21T14:00:00',
        dataAtualizacao: '2026-08-21T14:00:00',
        anexos: []
      },
      {
        id: 'not-02',
        titulo: 'Planejamento pessoal de revisão da cerca do Piquete 3',
        categoria: 'Campo',
        conteudo: 'Nota privada: adquirir 4 rolos de arame liso e 15 estacas de eucalipto tratado antes do início das chuvas de outubro/novembro.',
        fixada: true,
        privada: true,
        autorId: 'usr-admin-1',
        autorNome: 'Guilherme Dias Pereira',
        localizacao: 'Piquete 3 · Setor Zootécnico',
        dataCriacao: '2026-08-25T10:15:00',
        dataAtualizacao: '2026-08-25T10:15:00',
        anexos: []
      }
    ],
    publicacoesPortal: [
      {
        id: 'pub-01',
        titulo: 'Monitoramento Pluviométrico 2025–2026 supera 1.165 mm acumulados na Área Experimental',
        tipo: 'Pesquisa',
        resumo: 'Série histórica consolidada no sistema AMADEUS reúne 187 leituras diárias auditadas entre maio de 2025 e agosto de 2026.',
        conteudo: 'O projeto AMADEUS consolidou toda a base histórica de precipitação da Área Experimental do IF Baiano. Em 2025 (maio a dezembro) foram registrados 545,5 mm em 109 leituras, enquanto em 2026 (janeiro a agosto) já foram contabilizados 620,0 mm em 78 medições, com destaque para o evento extremo de 150 mm registrado em 02/03/2026.',
        status: 'Publicado',
        data: '2026-08-27',
        autor: 'Guilherme Dias Pereira & Prof. Charles Leonel',
        imagemUrl: ''
      },
      {
        id: 'pub-02',
        titulo: 'Acompanhamento de Ganho Médio Diário (GMD) integra aulas práticas de Zootecnia',
        tipo: 'Ensino',
        resumo: 'Estudantes utilizam fichas digitais em PDF e curvas de evolução ponderal para tomada de decisão nutricional no rebanho.',
        conteudo: 'A substituição das cadernetas de papel pelo módulo zootécnico do AMADEUS permitiu calcular instantaneamente o GMD individual dos animais e correlacionar a oferta de forragem com o regime de chuvas da propriedade.',
        status: 'Publicado',
        data: '2026-08-21',
        autor: 'Equipe AMADEUS',
        imagemUrl: ''
      },
      {
        id: 'pub-03',
        titulo: 'Oficina de Gestão Rural Sustentável e Uso de PWA no Campo',
        tipo: 'Extensão',
        resumo: 'Capacitação aberta para estudantes e produtores rurais sobre registro digital de atividades e controle pluviométrico.',
        conteudo: 'Evento de extensão voltado à difusão de tecnologias sociais e ferramentas digitais gratuitas para gestão de propriedades sustentáveis.',
        status: 'Rascunho',
        data: '2026-11-10',
        autor: 'Guilherme Dias Pereira',
        imagemUrl: ''
      }
    ],
    producaoEstoqueFinanceiro: {
      producao: [
        { id: 'prod-01', cultura: 'Milho Forrageiro (Silagem)', area: '2,5 ha', safra: '2025/2026', quantidade: '85 toneladas', status: 'Colhido e Ensilado', responsavel: 'Guilherme Dias Pereira' },
        { id: 'prod-02', cultura: 'Mandioca de Mesa (Área Experimental)', area: '0,8 ha', safra: '2026', quantidade: '14 toneladas (estimado)', status: 'Em desenvolvimento', responsavel: 'Felipe Zeca' }
      ],
      estoque: [
        { id: 'est-01', item: 'Sal Mineral Bovinos (Saco 25kg)', categoria: 'Nutrição Animal', quantidade: 18, unidade: 'sacos', estoqueMinimo: 5, local: 'Galpão de Insumos' },
        { id: 'est-02', item: 'Adubo Orgânico Compostado', categoria: 'Fertilizantes', quantidade: 1200, unidade: 'kg', estoqueMinimo: 300, local: 'Pátio de Compostagem' },
        { id: 'est-03', item: 'Brincos Numerados Bovinos/Ovinos', categoria: 'Identificação Zootécnica', quantidade: 45, unidade: 'unid', estoqueMinimo: 15, local: 'Almoxarifado Central' }
      ],
      financeiro: [
        { id: 'fin-01', data: '2026-08-05', tipo: 'Despesa', categoria: 'Insumos Pecuários', descricao: 'Aquisição de suplemento mineral e medicamentos preventivos', valor: 1450.00, responsavel: 'Guilherme Dias Pereira' },
        { id: 'fin-02', data: '2026-08-12', tipo: 'Despesa', categoria: 'Manutenção Rural', descricao: 'Conexões de PVC e fita gotejadora para área experimental', valor: 380.00, responsavel: 'Felipe Zeca' },
        { id: 'fin-03', data: '2026-08-18', tipo: 'Receita', categoria: 'Produção Excedente / Projeto', descricao: 'Repasse de custeio de projeto de pesquisa aplicada', valor: 3200.00, responsavel: 'Professor Charles Leonel' }
      ]
    },
    historicoExclusoes: []
  };
}

window.AMADEUS_SEED = {
  RAW_CSV_2025,
  RAW_CSV_2026,
  parseAmadeusCSV,
  getInitialDatabase
};
