export interface QuestionItem {
  id: number;
  letter: string;
  type: 'starts_with' | 'contains';
  typeLabelEs: string;
  typeLabelHy: string;
  theme: string;
  themeIcon: string;
  questionEs: string;
  questionHy: string;
  answerEs: string;
  acceptedAnswers: string[];
  answerHy: string;
  note?: string;
}

export interface BonusQuestion {
  id: number;
  questionEs: string;
  questionHy: string;
  answerEs: string;
  acceptedAnswers: string[];
  answerHy: string;
  theme: string;
}

export const ROSCO_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    letter: 'A',
    type: 'starts_with',
    typeLabelEs: 'Empieza por A',
    typeLabelHy: 'Սկսվում է A տառով',
    theme: 'Fútbol',
    themeIcon: '⚽',
    questionEs: 'Es la persona que controla un partido de fútbol, señala las faltas y puede mostrar tarjetas amarillas o rojas. ¿Quién es?',
    questionHy: 'Մարդ է, որը վերահսկում է ֆուտբոլային խաղը, արձանագրում է խախտումները և կարող է ցույց տալ դեղին կամ կարմիր քարտեր։ Ո՞վ է։',
    answerEs: 'Árbitro',
    acceptedAnswers: ['árbitro', 'arbitro', 'el árbitro', 'el arbitro', 'մրցավար'],
    answerHy: 'Մրցավար'
  },
  {
    id: 2,
    letter: 'B',
    type: 'starts_with',
    typeLabelEs: 'Empieza por B',
    typeLabelHy: 'Սկսվում է B տառով',
    theme: 'Fútbol',
    themeIcon: '⚽',
    questionEs: 'Es un objeto redondo que los futbolistas golpean con los pies. Sin él, no se puede jugar un partido. ¿Qué es?',
    questionHy: 'Կլոր առարկա է, որին ֆուտբոլիստները հարվածում են ոտքերով։ Առանց դրա հնարավոր չէ ֆուտբոլ խաղալ։ Ի՞նչ է։',
    answerEs: 'Balón',
    acceptedAnswers: ['balón', 'balon', 'el balón', 'el balon', 'pelota', 'գնդակ'],
    answerHy: 'Գնդակ'
  },
  {
    id: 3,
    letter: 'C',
    type: 'starts_with',
    typeLabelEs: 'Empieza por C',
    typeLabelHy: 'Սկսվում է C տառով',
    theme: 'Fútbol',
    themeIcon: '⚽',
    questionEs: 'Cuando el balón sale por la línea de fondo después de tocar a un defensor, el equipo atacante puede sacar desde una esquina del campo. ¿Cómo se llama este saque?',
    questionHy: 'Երբ գնդակը պաշտպանվող խաղացողին դիպչելուց հետո դուրս է գալիս դաշտի վերջնագծից, հարձակվող թիմը կարող է հարվածել դաշտի անկյունից։ Ինչպե՞ս է կոչվում այդ հարվածը։',
    answerEs: 'Córner',
    acceptedAnswers: ['córner', 'corner', 'tiro de esquina', 'el córner', 'անկյունային', 'անկյունային հարված'],
    answerHy: 'Անկյունային հարված'
  },
  {
    id: 4,
    letter: 'D',
    type: 'starts_with',
    typeLabelEs: 'Empieza por D',
    typeLabelHy: 'Սկսվում է D տառով',
    theme: 'Días',
    themeIcon: '📅',
    questionEs: 'Es el día de la semana que viene después del sábado y antes del lunes. Muchas personas descansan ese día. ¿Qué día es?',
    questionHy: 'Շաբաթվա այն օրն է, որը գալիս է շաբաթից հետո և երկուշաբթիից առաջ։ Շատ մարդիկ այդ օրը հանգստանում են։ Ո՞ր օրն է։',
    answerEs: 'Domingo',
    acceptedAnswers: ['domingo', 'el domingo', 'կիրակի'],
    answerHy: 'Կիրակի'
  },
  {
    id: 5,
    letter: 'E',
    type: 'starts_with',
    typeLabelEs: 'Empieza por E',
    typeLabelHy: 'Սկսվում է E տառով',
    theme: 'Fútbol',
    themeIcon: '⚽',
    questionEs: 'Si un partido termina 2-2 y ninguno de los equipos gana, ¿cómo se llama el resultado?',
    questionHy: 'Եթե ֆուտբոլային խաղն ավարտվում է 2-2 հաշվով, և թիմերից ոչ մեկը չի հաղթում, ինչպե՞ս է կոչվում արդյունքը։',
    answerEs: 'Empate',
    acceptedAnswers: ['empate', 'el empate', 'ոչ-ոքի', 'ոչ ոքի'],
    answerHy: 'Ոչ-ոքի'
  },
  {
    id: 6,
    letter: 'F',
    type: 'contains',
    typeLabelEs: 'Contiene la F',
    typeLabelHy: 'Պարունակում է F տառը',
    theme: 'Días',
    themeIcon: '📅',
    questionEs: 'Es el día que viene después del jueves y antes del sábado. Para muchos estudiantes es el último día de clases de la semana. ¿Qué día es?',
    questionHy: 'Այն օրն է, որը գալիս է հինգշաբթիից հետո և շաբաթից առաջ։ Շատ աշակերտների համար շաբաթվա վերջին դասի օրն է։ Ո՞ր օրն է։',
    answerEs: 'Viernes',
    acceptedAnswers: ['viernes', 'el viernes', 'ուրբաթ'],
    answerHy: 'Ուրբաթ',
    note: 'Contiene la F, no empieza por F.'
  },
  {
    id: 7,
    letter: 'G',
    type: 'starts_with',
    typeLabelEs: 'Empieza por G',
    typeLabelHy: 'Սկսվում է G տառով',
    theme: 'Fútbol',
    themeIcon: '⚽',
    questionEs: 'Es lo que quiere conseguir un delantero cuando dispara a la portería. Los aficionados gritan de alegría cuando el balón entra. ¿Qué es?',
    questionHy: 'Դա այն է, ինչ ցանկանում է անել հարձակվողը, երբ հարվածում է դարպասին։ Երկրպագուները ուրախությունից գոռում են, երբ գնդակը մտնում է դարպասը։ Ի՞նչ է։',
    answerEs: 'Gol',
    acceptedAnswers: ['gol', 'el gol', 'tanto', 'գոլ'],
    answerHy: 'Գոլ'
  },
  {
    id: 8,
    letter: 'H',
    type: 'starts_with',
    typeLabelEs: 'Empieza por H',
    typeLabelHy: 'Սկսվում է H տառով',
    theme: 'Fútbol',
    themeIcon: '⚽',
    questionEs: 'Cuando un mismo futbolista marca tres goles en un solo partido, consigue algo muy especial. ¿Cómo se llama?',
    questionHy: 'Երբ նույն ֆուտբոլիստը մեկ խաղում երեք գոլ է խփում, դա հատուկ անվանում ունի։ Ինչպե՞ս է կոչվում։',
    answerEs: 'Hat-trick',
    acceptedAnswers: ['hat-trick', 'hat trick', 'hattrick', 'triplete', 'հեթ-տրիկ', 'հեթ տրիկ'],
    answerHy: 'Հեթ-տրիկ'
  },
  {
    id: 9,
    letter: 'I',
    type: 'contains',
    typeLabelEs: 'Contiene la I',
    typeLabelHy: 'Պարունակում է I տառը',
    theme: 'Días',
    themeIcon: '📅',
    questionEs: 'Es el día de la semana que viene después del martes y antes del jueves. ¿Qué día es?',
    questionHy: 'Շաբաթվա այն օրն է, որը գալիս է երեքշաբթիից հետո և հինգշաբթիից առաջ։ Ո՞ր օրն է։',
    answerEs: 'Miércoles',
    acceptedAnswers: ['miércoles', 'miercoles', 'el miércoles', 'el miercoles', 'չորեքշաբթի'],
    answerHy: 'Չորեքշաբթի'
  },
  {
    id: 10,
    letter: 'J',
    type: 'starts_with',
    typeLabelEs: 'Empieza por J',
    typeLabelHy: 'Սկսվում է J տառով',
    theme: 'Días',
    themeIcon: '📅',
    questionEs: 'Si hoy es miércoles, mañana será este día. Y al día siguiente será viernes. ¿Qué día es?',
    questionHy: 'Եթե այսօր չորեքշաբթի է, վաղը կլինի այս օրը։ Իսկ հաջորդ օրը՝ ուրբաթ։ Ո՞ր օրն է։',
    answerEs: 'Jueves',
    acceptedAnswers: ['jueves', 'el jueves', 'հինգշաբթի'],
    answerHy: 'Հինգշաբթի'
  },
  {
    id: 11,
    letter: 'K',
    type: 'starts_with',
    typeLabelEs: 'Empieza por K',
    typeLabelHy: 'Սկսվում է K տառով',
    theme: 'Fútbol y números',
    themeIcon: '📏',
    questionEs: 'Durante un partido, un futbolista puede correr muchos de estos. Cada uno equivale a mil metros. ¿Qué unidad es?',
    questionHy: 'Ֆուտբոլային խաղի ընթացքում ֆուտբոլիստը կարող է անցնել դրանցից շատերը։ Դրանցից յուրաքանչյուրը հավասար է հազար մետրի։ Ի՞նչ չափման միավոր է։',
    answerEs: 'Kilómetro',
    acceptedAnswers: ['kilómetro', 'kilometro', 'el kilómetro', 'km', 'կիլոմետր'],
    answerHy: 'Կիլոմետր'
  },
  {
    id: 12,
    letter: 'L',
    type: 'starts_with',
    typeLabelEs: 'Empieza por L',
    typeLabelHy: 'Սկսվում է L տառով',
    theme: 'Días',
    themeIcon: '📅',
    questionEs: 'Es el primer día de la semana. Normalmente los estudiantes vuelven al colegio después del fin de semana. ¿Qué día es?',
    questionHy: 'Շաբաթվա առաջին օրն է։ Սովորաբար աշակերտները հանգստյան օրերից հետո վերադառնում են դպրոց։ Ո՞ր օրն է։',
    answerEs: 'Lunes',
    acceptedAnswers: ['lunes', 'el lunes', 'երկուշաբթի'],
    answerHy: 'Երկուշաբթի'
  },
  {
    id: 13,
    letter: 'M',
    type: 'starts_with',
    typeLabelEs: 'Empieza por M',
    typeLabelHy: 'Սկսվում է M տառով',
    theme: 'Días',
    themeIcon: '📅',
    questionEs: 'Es el segundo día de la semana. Viene después del lunes y antes del miércoles. ¿Qué día es?',
    questionHy: 'Շաբաթվա երկրորդ օրն է։ Գալիս է երկուշաբթիից հետո և չորեքշաբթիից առաջ։ Ո՞ր օրն է։',
    answerEs: 'Martes',
    acceptedAnswers: ['martes', 'el martes', 'երեքշաբթի'],
    answerHy: 'Երեքշաբթի'
  },
  {
    id: 14,
    letter: 'N',
    type: 'starts_with',
    typeLabelEs: 'Empieza por N',
    typeLabelHy: 'Սկսվում է N տառով',
    theme: 'Números',
    themeIcon: '🔢',
    questionEs: 'En un partido, un equipo ha marcado cuatro goles y el otro cinco. Si sumamos todos los goles, ¿qué número obtenemos?',
    questionHy: 'Մի թիմը խփել է չորս գոլ, իսկ մյուսը՝ հինգ։ Եթե գումարենք բոլոր գոլերը, ի՞նչ թիվ կստանանք։',
    answerEs: 'Nueve',
    acceptedAnswers: ['nueve', 'el nueve', '9', 'ինը'],
    answerHy: 'Ինը'
  },
  {
    id: 15,
    letter: 'Ñ',
    type: 'contains',
    typeLabelEs: 'Contiene la Ñ',
    typeLabelHy: 'Պարունակում է Ñ տառը',
    theme: 'Calendario',
    themeIcon: '🗓️',
    questionEs: 'Es un período de tiempo que normalmente tiene 365 días y está dividido en doce meses. ¿Qué es?',
    questionHy: 'Ժամանակահատված է, որը սովորաբար ունի 365 օր և բաժանված է տասներկու ամսվա։ Ի՞նչ է։',
    answerEs: 'Año',
    acceptedAnswers: ['año', 'ano', 'el año', 'տարի'],
    answerHy: 'Տարի'
  },
  {
    id: 16,
    letter: 'O',
    type: 'starts_with',
    typeLabelEs: 'Empieza por O',
    typeLabelHy: 'Սկսվում է O տառով',
    theme: 'Fútbol y números',
    themeIcon: '🔢',
    questionEs: '¿Cuántos jugadores tiene normalmente un equipo de fútbol en el campo al comenzar un partido?',
    questionHy: 'Քանի՞ խաղացող է սովորաբար ունենում ֆուտբոլային թիմը խաղադաշտում խաղի սկզբում։',
    answerEs: 'Once',
    acceptedAnswers: ['once', '11', 'տասնմեկ'],
    answerHy: 'Տասնմեկ'
  },
  {
    id: 17,
    letter: 'P',
    type: 'starts_with',
    typeLabelEs: 'Empieza por P',
    typeLabelHy: 'Սկսվում է P տառով',
    theme: 'Fútbol',
    themeIcon: '🧤',
    questionEs: 'Es el único jugador de un equipo de fútbol que puede tocar el balón con las manos dentro de su propia área de penalti durante el juego normal. ¿Quién es?',
    questionHy: 'Ֆուտբոլային թիմի միակ խաղացողն է, որը սովորական խաղային իրավիճակում կարող է գնդակին ձեռքով դիպչել իր տուգանային հրապարակում։ Ո՞վ է։',
    answerEs: 'Portero',
    acceptedAnswers: ['portero', 'el portero', 'guardameta', 'arquero', 'դարպասապահ'],
    answerHy: 'Դարպասապահ'
  },
  {
    id: 18,
    letter: 'Q',
    type: 'starts_with',
    typeLabelEs: 'Empieza por Q',
    typeLabelHy: 'Սկսվում է Q տառով',
    theme: 'Números',
    themeIcon: '🔢',
    questionEs: 'Si tienes diez camisetas de fútbol y compras cinco más, ¿cuántas camisetas tienes en total?',
    questionHy: 'Եթե ունես տասը ֆուտբոլային մարզաշապիկ և գնում ես ևս հինգը, ընդհանուր քանի՞ մարզաշապիկ կունենաս։',
    answerEs: 'Quince',
    acceptedAnswers: ['quince', '15', 'տասնհինգ'],
    answerHy: 'Տասնհինգ'
  },
  {
    id: 19,
    letter: 'R',
    type: 'starts_with',
    typeLabelEs: 'Empieza por R',
    typeLabelHy: 'Սկսվում է R տառով',
    theme: 'Fútbol',
    themeIcon: '🟥',
    questionEs: '¿De qué color es la tarjeta que muestra el árbitro cuando expulsa directamente a un jugador?',
    questionHy: 'Ի՞նչ գույնի քարտ է ցույց տալիս մրցավարը, երբ անմիջապես հեռացնում է խաղացողին դաշտից։',
    answerEs: 'Roja',
    acceptedAnswers: ['roja', 'rojo', 'tarjeta roja', 'la roja', 'կարմիր'],
    answerHy: 'Կարմիր'
  },
  {
    id: 20,
    letter: 'S',
    type: 'starts_with',
    typeLabelEs: 'Empieza por S',
    typeLabelHy: 'Սկսվում է S տառով',
    theme: 'Días',
    themeIcon: '📅',
    questionEs: 'Es el día que viene después del viernes y antes del domingo. Muchas personas aprovechan este día para jugar al fútbol con sus amigos. ¿Qué día es?',
    questionHy: 'Այն օրն է, որը գալիս է ուրբաթից հետո և կիրակիից առաջ։ Շատերն այդ օրը օգտագործում են ընկերների հետ ֆուտբոլ խաղալու համար։ Ո՞ր օրն է։',
    answerEs: 'Sábado',
    acceptedAnswers: ['sábado', 'sabado', 'el sábado', 'el sabado', 'շաբաթ'],
    answerHy: 'Շաբաթ'
  },
  {
    id: 21,
    letter: 'T',
    type: 'starts_with',
    typeLabelEs: 'Empieza por T',
    typeLabelHy: 'Սկսվում է T տառով',
    theme: 'Números',
    themeIcon: '🔢',
    questionEs: 'Un futbolista marca un gol en la primera parte y dos goles en la segunda. ¿Cuántos goles ha marcado en total?',
    questionHy: 'Ֆուտբոլիստը առաջին խաղակեսում խփում է մեկ գոլ, իսկ երկրորդում՝ երկու։ Ընդհանուր քանի՞ գոլ է խփել։',
    answerEs: 'Tres',
    acceptedAnswers: ['tres', '3', 'երեք'],
    answerHy: 'Երեք'
  },
  {
    id: 22,
    letter: 'U',
    type: 'starts_with',
    typeLabelEs: 'Empieza por U',
    typeLabelHy: 'Սկսվում է U տառով',
    theme: 'Números',
    themeIcon: '🔢',
    questionEs: 'Si un equipo marca dos goles, pero el árbitro anula uno por fuera de juego, ¿cuántos goles válidos quedan?',
    questionHy: 'Եթե թիմը խփում է երկու գոլ, բայց մրցավարը մեկը չեղարկում է խաղից դուրս վիճակի պատճառով, քանի՞ հաշվված գոլ է մնում։',
    answerEs: 'Uno',
    acceptedAnswers: ['uno', 'un', '1', 'մեկ'],
    answerHy: 'Մեկ'
  },
  {
    id: 23,
    letter: 'V',
    type: 'starts_with',
    typeLabelEs: 'Empieza por V',
    typeLabelHy: 'Սկսվում է V տառով',
    theme: 'Números',
    themeIcon: '🔢',
    questionEs: 'Un entrenador tiene diez balones en una bolsa y diez en otra. ¿Cuántos balones tiene en total?',
    questionHy: 'Մարզիչը մի պայուսակում ունի տասը գնդակ, իսկ մյուսում՝ ևս տասը։ Ընդհանուր քանի՞ գնդակ ունի։',
    answerEs: 'Veinte',
    acceptedAnswers: ['veinte', '20', 'քսան'],
    answerHy: 'Քսան'
  },
  {
    id: 24,
    letter: 'W',
    type: 'starts_with',
    typeLabelEs: 'Empieza por W',
    typeLabelHy: 'Սկսվում է W տառով',
    theme: 'Fútbol',
    themeIcon: '🏟️',
    questionEs: 'Es el nombre de un famoso estadio de fútbol situado en Londres, Inglaterra, donde se celebran grandes finales. ¿Cómo se llama?',
    questionHy: 'Անգլիայի Լոնդոն քաղաքում գտնվող հայտնի ֆուտբոլային մարզադաշտ է, որտեղ անցկացվում են կարևոր եզրափակիչ խաղեր։ Ինչպե՞ս է կոչվում։',
    answerEs: 'Wembley',
    acceptedAnswers: ['wembley', 'estadio wembley', 'ուեմբլի'],
    answerHy: 'Ուեմբլի'
  },
  {
    id: 25,
    letter: 'X',
    type: 'contains',
    typeLabelEs: 'Contiene la X',
    typeLabelHy: 'Պարունակում է X տառը',
    theme: 'Fútbol',
    themeIcon: '🛑',
    questionEs: 'Si un jugador recibe una tarjeta roja y tiene que abandonar el campo, ¿cómo se llama esta sanción?',
    questionHy: 'Եթե ֆուտբոլիստը ստանում է կարմիր քարտ և ստիպված է լքել խաղադաշտը, ինչպե՞ս է կոչվում այդ պատիժը։',
    answerEs: 'Expulsión',
    acceptedAnswers: ['expulsión', 'expulsion', 'la expulsión', 'հեռացում'],
    answerHy: 'Հեռացում'
  },
  {
    id: 26,
    letter: 'Y',
    type: 'contains',
    typeLabelEs: 'Contiene la Y',
    typeLabelHy: 'Պարունակում է Y տառը',
    theme: 'Números',
    themeIcon: '⚖️',
    questionEs: 'Si comparamos los números veinte y diez, decimos que veinte es ... que diez. ¿Qué palabra falta?',
    questionHy: 'Եթե համեմատենք քսան և տասը թվերը, ասում ենք, որ քսանը տասից ... է։ Ո՞ր բառն է բացակայում։',
    answerEs: 'Mayor',
    acceptedAnswers: ['mayor', 'ավելի մեծ'],
    answerHy: 'Ավելի մեծ'
  },
  {
    id: 27,
    letter: 'Z',
    type: 'starts_with',
    typeLabelEs: 'Empieza por Z',
    typeLabelHy: 'Սկսվում է Z տառով',
    theme: 'Fútbol',
    themeIcon: '🛡️',
    questionEs: 'Es un futbolista que juega principalmente en defensa. Su misión es impedir que los delanteros rivales se acerquen a la portería. ¿Quién es?',
    questionHy: 'Ֆուտբոլիստ է, որը հիմնականում խաղում է պաշտպանությունում։ Նրա խնդիրն է թույլ չտալ, որ մրցակցի հարձակվողները մոտենան դարպասին։ Ո՞վ է։',
    answerEs: 'Zaguero',
    acceptedAnswers: ['zaguero', 'el zaguero', 'defensa', 'պաշտպան'],
    answerHy: 'Պաշտպան'
  }
];

export const BONUS_QUESTIONS: BonusQuestion[] = [
  {
    id: 1,
    questionEs: '¿Qué día viene dos días después del lunes?',
    questionHy: 'Ո՞ր օրն է գալիս երկուշաբթիից երկու օր հետո։',
    answerEs: 'Miércoles',
    acceptedAnswers: ['miércoles', 'miercoles', 'el miércoles', 'չորեքշաբթի'],
    answerHy: 'Չորեքշաբթի',
    theme: 'Días'
  },
  {
    id: 2,
    questionEs: 'Si hoy es viernes, ¿qué día será dentro de tres días?',
    questionHy: 'Եթե այսօր ուրբաթ է, երեք օր հետո ի՞նչ օր կլինի։',
    answerEs: 'Lunes',
    acceptedAnswers: ['lunes', 'el lunes', 'երկուշաբթի'],
    answerHy: 'Երկուշաբթի',
    theme: 'Días'
  },
  {
    id: 3,
    questionEs: '¿Cuántos minutos dura normalmente un partido de fútbol sin contar el tiempo añadido?',
    questionHy: 'Սովորաբար քանի՞ րոպե է տևում ֆուտբոլային խաղը՝ առանց ավելացված ժամանակի։',
    answerEs: 'Noventa',
    acceptedAnswers: ['noventa', '90', '90 minutos', 'noventa minutos', 'իննսուն', '90 րոպե'],
    answerHy: 'Իննսուն',
    theme: 'Fútbol y números'
  },
  {
    id: 4,
    questionEs: '¿Cuántos días tiene una semana?',
    questionHy: 'Քանի՞ օր ունի մեկ շաբաթը։',
    answerEs: 'Siete',
    acceptedAnswers: ['siete', '7', '7 días', 'siete días', 'յոթ'],
    answerHy: 'Յոթ',
    theme: 'Días y números'
  },
  {
    id: 5,
    questionEs: 'Si un equipo gana 4-1, ¿por cuántos goles ha ganado?',
    questionHy: 'Եթե թիմը հաղթում է 4-1 հաշվով, քանի՞ գոլի տարբերությամբ է հաղթում։',
    answerEs: 'Tres',
    acceptedAnswers: ['tres', '3', 'por tres', 'tres goles', 'երեք'],
    answerHy: 'Երեք',
    theme: 'Fútbol y números'
  },
  {
    id: 6,
    questionEs: '¿Qué día viene antes del domingo?',
    questionHy: 'Ո՞ր օրն է գալիս կիրակիից առաջ։',
    answerEs: 'Sábado',
    acceptedAnswers: ['sábado', 'sabado', 'el sábado', 'շաբաթ'],
    answerHy: 'Շաբաթ',
    theme: 'Días'
  },
  {
    id: 7,
    questionEs: '¿Cuánto es doce más ocho?',
    questionHy: 'Որքա՞ն է տասներկուսին գումարած ութը։',
    answerEs: 'Veinte',
    acceptedAnswers: ['veinte', '20', 'քսան'],
    answerHy: 'Քսան',
    theme: 'Números'
  },
  {
    id: 8,
    questionEs: '¿Cuántas partes de cuarenta y cinco minutos tiene normalmente un partido de fútbol?',
    questionHy: 'Սովորաբար քառասունհինգ րոպեանոց քանի՞ խաղակես ունի ֆուտբոլային խաղը։',
    answerEs: 'Dos',
    acceptedAnswers: ['dos', '2', 'երկու', 'dos partes'],
    answerHy: 'Երկու',
    theme: 'Fútbol y números'
  },
  {
    id: 9,
    questionEs: '¿Qué día será mañana si hoy es jueves?',
    questionHy: 'Եթե այսօր հինգշաբթի է, վաղը ո՞ր օրը կլինի։',
    answerEs: 'Viernes',
    acceptedAnswers: ['viernes', 'el viernes', 'ուրբաթ'],
    answerHy: 'Ուրբաթ',
    theme: 'Días'
  },
  {
    id: 10,
    questionEs: 'Si tienes treinta euros y compras un balón por dieciocho euros, ¿cuánto dinero te queda?',
    questionHy: 'Եթե ունես երեսուն եվրո և գնում ես տասնութ եվրո արժողությամբ գնդակ, որքա՞ն գումար կմնա։',
    answerEs: 'Doce euros',
    acceptedAnswers: ['doce euros', 'doce', '12', '12 euros', 'տասներկու', 'տասներկու եվրո'],
    answerHy: 'Տասներկու եվրո',
    theme: 'Números'
  }
];

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics for flexible matching
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?¿!¡]/g, '')
    .replace(/\s+/g, ' ');
}

export function checkAnswer(userInput: string, targetAnswer: string, acceptedAnswers: string[]): boolean {
  const normUser = normalizeText(userInput);
  if (!normUser) return false;
  
  const normTarget = normalizeText(targetAnswer);
  if (normUser === normTarget) return true;

  for (const alt of acceptedAnswers) {
    if (normalizeText(alt) === normUser) return true;
  }
  return false;
}
