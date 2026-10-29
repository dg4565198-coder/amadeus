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
        nome: 'Guilherme Dias Pereira',
        login: 'guilherme',
        email: 'guilherme@amadeus.rural',
        senhaHash: 'admin123',
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
        senhaHash: 'charles123',
        perfil: 'admin',
        statusAcesso: 'aprovado',
        cargo: 'Docente e Coordenador de Pesquisa',
        ativo: true,
        permissoes: ['tudo', 'exportar', 'admin', 'portal']
      },
      {
        id: 'usr-colab-1',
        nome: 'Felipe Zeca',
        login: 'zeca',
        email: 'zeca@amadeus.rural',
        senhaHash: 'zeca123',
        perfil: 'colaborador',
        statusAcesso: 'aprovado',
        cargo: 'Colaborador de Campo e Monitoramento',
        ativo: true,
        permissoes: ['consultar', 'registrar', 'exportar']
      },
      {
        id: 'usr-colab-2',
        nome: 'Alisson',
        login: 'alisson',
        email: 'alisson@amadeus.rural',
        senhaHash: 'alisson123',
        perfil: 'colaborador',
        statusAcesso: 'aprovado',
        cargo: 'Colaborador de Manejo Rural',
        ativo: true,
        permissoes: ['consultar', 'registrar', 'exportar']
      },
      {
        id: 'usr-leitor-1',
        nome: 'Visitante / Consulta Técnica',
        login: 'leitor',
        email: 'leitor@amadeus.rural',
        senhaHash: 'leitor123',
        perfil: 'leitor',
        statusAcesso: 'aprovado',
        cargo: 'Leitor / Consulta de Relatórios',
        ativo: true,
        permissoes: ['consultar', 'exportar']
      }
    ],
    pessoas: [
      {
        id: 'pes-01',
        nome: 'Guilherme Dias Pereira',
        funcao: 'Coordenador / Gestor do Sistema',
        setor: 'Agricultura e Pecuária',
        vinculo: 'Responsável Técnico',
        documento: 'MAT-2025001',
        telefone: '(77) 99900-0001',
        biometriaCadastrada: true,
        biometriaId: 'BIO-GUILHERME-SHA256-9F8A',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 48,
        observacoes: 'Responsável pela consolidação dos dados pluviométricos e gestão do sistema AMADEUS.'
      },
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
        horasBase: 64,
        observacoes: 'Principal responsável pelas leituras diárias do Pluviômetro 1 na Área Experimental.'
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
        horasBase: 42,
        observacoes: 'Atua no monitoramento pluviométrico, manejo de pastagens e trato animal.'
      },
      {
        id: 'pes-04',
        nome: 'Professor Charles Leonel',
        funcao: 'Docente / Orientador Técnico',
        setor: 'Pesquisa e Ensino',
        vinculo: 'Servidor Docente',
        documento: 'SIAPE-102938',
        telefone: '(77) 99900-0004',
        biometriaCadastrada: true,
        biometriaId: 'BIO-CHARLES-SHA256-1A5F',
        biometriaModalidade: 'Agricultura e Pecuária',
        horasBase: 30,
        observacoes: 'Supervisão acadêmica e validação de experimentos na área experimental.'
      },
      {
        id: 'pes-05',
        nome: 'Ferreira - 2º Agro',
        funcao: 'Estudante / Monitor de Agropecuária',
        setor: 'Agricultura',
        vinculo: 'Discente 2º Ano Agro',
        documento: 'DIS-2025105',
        telefone: '',
        biometriaCadastrada: true,
        biometriaId: 'BIO-FERREIRA-SHA256-3E9C',
        biometriaModalidade: 'Agricultura',
        horasBase: 24,
        observacoes: 'Participação ativa nas coletas pluviométricas entre agosto e novembro de 2025.'
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
        horasBase: 16,
        observacoes: 'Apoio às leituras da Área Experimental em novembro de 2025.'
      },
      {
        id: 'pes-07',
        nome: 'Marcos Maciel',
        funcao: 'Colaborador de Campo',
        setor: 'Agricultura',
        vinculo: 'Colaborador',
        documento: 'COL-2025107',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura',
        horasBase: 12,
        observacoes: 'Registros iniciais de maio de 2025.'
      },
      {
        id: 'pes-08',
        nome: 'Gustavo Nunes',
        funcao: 'Colaborador de Campo',
        setor: 'Pecuária',
        vinculo: 'Colaborador',
        documento: 'COL-2025108',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Pecuária',
        horasBase: 14,
        observacoes: 'Registros de maio e junho de 2025.'
      },
      {
        id: 'pes-09',
        nome: 'Cristina Vales',
        funcao: 'Bolsista / Apoio Técnico',
        setor: 'Agricultura',
        vinculo: 'Colaboradora',
        documento: 'COL-2025109',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura',
        horasBase: 10,
        observacoes: 'Apoio técnico na Área Experimental.'
      },
      {
        id: 'pes-10',
        nome: 'Kássio Mickael',
        funcao: 'Monitor de Campo',
        setor: 'Agricultura',
        vinculo: 'Discente',
        documento: 'DIS-2025110',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura',
        horasBase: 8,
        observacoes: 'Participação nos registros de junho de 2025.'
      },
      {
        id: 'pes-11',
        nome: 'Luanna Alves - 2º Agro',
        funcao: 'Estudante / Monitora de Agropecuária',
        setor: 'Agricultura',
        vinculo: 'Discente 2º Ano Agro',
        documento: 'DIS-2025111',
        telefone: '',
        biometriaCadastrada: false,
        biometriaId: '',
        biometriaModalidade: 'Agricultura',
        horasBase: 10,
        observacoes: 'Monitoramento na Área Experimental.'
      },
      {
        id: 'pes-12',
        nome: 'Isabely Neves',
        funcao: 'Bolsista / Monitora',
        setor: 'Agricultura',
        vinculo: 'Discente',
        documento: 'DIS-2026112',
        telefone: '',
        biometriaCadastrada: true,
        biometriaId: 'BIO-ISABELY-SHA256-8B2A',
        biometriaModalidade: 'Agricultura',
        horasBase: 12,
        observacoes: 'Monitoramento pluviométrico de abril de 2026.'
      }
    ],
    registrosBiometricos: [
      {
        id: 'regbio-01',
        pessoaId: 'pes-02',
        pessoaNome: 'Felipe Zeca',
        setor: 'Agricultura',
        tipo: 'Entrada / Leitura Pluviométrica',
        dataHora: '2026-08-20T07:00:00',
        local: 'Área experimental IF Baiano',
        hashAssinatura: 'BIO-ZECA-SHA256-4C2E-VERIFIED',
        metodo: 'Biometria validada'
      },
      {
        id: 'regbio-02',
        pessoaId: 'pes-01',
        pessoaNome: 'Guilherme Dias Pereira',
        setor: 'Pecuária',
        tipo: 'Manejo e Pesagem Zootécnica',
        dataHora: '2026-08-21T13:20:00',
        local: 'Setor Zootécnico / Curral',
        hashAssinatura: 'BIO-GUILHERME-SHA256-9F8A-VERIFIED',
        metodo: 'Biometria validada'
      }
    ],
    atividades: [
      {
        id: 'atv-01',
        titulo: 'Manutenção do Pluviômetro 1 e Limpeza da Área Experimental',
        categoria: 'Agricultura',
        data: '2026-08-20',
        horaInicio: '07:00',
        horaFim: '11:00',
        horasTrabalhadas: 4,
        local: 'Área experimental IF Baiano (-14.2251, -41.4562)',
        status: 'Concluída',
        responsaveisIds: ['pes-01', 'pes-02'],
        responsaveisNomes: ['Guilherme Dias Pereira', 'Felipe Zeca'],
        descricao: 'Conferência de nivelamento do Pluviômetro 1 após precipitação de 6 mm, roçagem do entorno e verificação de cercas da área experimental.',
        anexos: []
      },
      {
        id: 'atv-02',
        titulo: 'Pesagem Mensal do Lote Bovino e Avaliação de Escore Corporal',
        categoria: 'Pecuária',
        data: '2026-08-21',
        horaInicio: '08:00',
        horaFim: '12:30',
        horasTrabalhadas: 4.5,
        local: 'Setor de Bovinocultura · Curral Principal',
        status: 'Concluída',
        responsaveisIds: ['pes-01', 'pes-03', 'pes-04'],
        responsaveisNomes: ['Guilherme Dias Pereira', 'Alisson', 'Professor Charles Leonel'],
        descricao: 'Pesagem individual dos animais em acompanhamento de GMD, revisão de brincos numerados e suplementação mineral.',
        anexos: []
      },
      {
        id: 'atv-03',
        titulo: 'Preparo de Canteiros e Irrigação por Gotejamento',
        categoria: 'Agricultura',
        data: '2026-08-25',
        horaInicio: '07:30',
        horaFim: '11:30',
        horasTrabalhadas: 4,
        local: 'Horta Didática · Talhão 02',
        status: 'Concluída',
        responsaveisIds: ['pes-02', 'pes-05'],
        responsaveisNomes: ['Felipe Zeca', 'Ferreira - 2º Agro'],
        descricao: 'Incorporação de composto orgânico nos canteiros e revisão das linhas de gotejamento devido ao período de 0 mm de precipitação.',
        anexos: []
      }
    ],
    agendamentos: [
      {
        id: 'agd-01',
        titulo: 'Coleta Pluviométrica Matinal e Inspeção de Pastagem',
        data: '2026-10-29',
        horario: '08:30',
        local: 'Área experimental IF Baiano',
        responsavel: 'Felipe Zeca',
        corCartao: 'amarelo',
        status: 'Agendada',
        notificadoCadastro: true,
        lembrete2hEnviado: false,
        observacoes: 'Conferir Pluviômetro 1 e registrar no AMADEUS antes das 09h00.'
      },
      {
        id: 'agd-02',
        titulo: 'Pesagem Zootécnica e Cálculo de GMD do Rebanho',
        data: '2026-10-30',
        horario: '09:00',
        local: 'Curral de Manejo · Setor Zootécnico',
        responsavel: 'Guilherme Dias Pereira',
        corCartao: 'verde',
        status: 'Confirmada',
        notificadoCadastro: true,
        lembrete2hEnviado: false,
        observacoes: 'Jejum prévio programado; emitir fichas em PDF após a pesagem.'
      },
      {
        id: 'agd-03',
        titulo: 'Reunião Técnica de Avaliação das Séries de Chuva 2025/2026',
        data: '2026-11-03',
        horario: '14:00',
        local: 'Laboratório de Agropecuária',
        responsavel: 'Professor Charles Leonel',
        corCartao: 'amarelo',
        status: 'Agendada',
        notificadoCadastro: true,
        lembrete2hEnviado: false,
        observacoes: 'Analisar comparativo de maio–agosto 2025 vs 2026.'
      }
    ],
    animais: [
      {
        id: 'ani-01',
        brinco: 'BR-101',
        nome: 'Soberano',
        especie: 'Bovino',
        raca: 'Nelore PO',
        sexo: 'Macho',
        dataNascimento: '2024-09-10',
        lote: 'Lote Recria Pasto 01',
        status: 'Ativo',
        observacoes: 'Animal de destaque no ganho de peso em pastagem manejada.',
        pesagens: [
          { id: 'p-101-1', data: '2026-01-15', peso: 280.0, observacao: 'Entrada no lote experimental' },
          { id: 'p-101-2', data: '2026-03-16', peso: 331.0, observacao: 'Período das águas (GMD elevado)' },
          { id: 'p-101-3', data: '2026-05-15', peso: 376.0, observacao: 'Final do período chuvoso' },
          { id: 'p-101-4', data: '2026-08-21', peso: 438.5, observacao: 'Suplementação proteico-energética na seca' }
        ]
      },
      {
        id: 'ani-02',
        brinco: 'BR-102',
        nome: 'Estrela',
        especie: 'Bovino',
        raca: 'Girolando 3/4',
        sexo: 'Fêmea',
        dataNascimento: '2024-11-04',
        lote: 'Lote Novilhas 02',
        status: 'Ativo',
        observacoes: 'Excelente desenvolvimento corporal e docilidade no manejo.',
        pesagens: [
          { id: 'p-102-1', data: '2026-01-15', peso: 245.0, observacao: 'Pesagem inicial de 2026' },
          { id: 'p-102-2', data: '2026-04-15', peso: 299.0, observacao: 'Acompanhamento trimestral' },
          { id: 'p-102-3', data: '2026-08-21', peso: 368.0, observacao: 'Avaliação de escore corporal 3.5' }
        ]
      },
      {
        id: 'ani-03',
        brinco: 'OV-205',
        nome: 'Valente',
        especie: 'Ovino',
        raca: 'Santa Inês',
        sexo: 'Macho',
        dataNascimento: '2025-08-12',
        lote: 'Aprisco Experimental',
        status: 'Ativo',
        observacoes: 'Reprodutor jovem em teste de desempenho zootécnico.',
        pesagens: [
          { id: 'p-205-1', data: '2026-02-10', peso: 28.5, observacao: 'Início do controle individual' },
          { id: 'p-205-2', data: '2026-05-11', peso: 42.0, observacao: 'Ganho consistente de 0.150 kg/dia' },
          { id: 'p-205-3', data: '2026-08-21', peso: 54.2, observacao: 'Pronto para estação de monta' }
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
