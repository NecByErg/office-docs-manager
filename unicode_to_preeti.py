# ========================================================
# Nepali Unicode -> Preeti Font Converter
# By Dear Er / Office Docs Manager
# ========================================================

import re

UNICODE_TO_PREETI_CHARS = {
    # Numbers
    '०': ')', '१': '!', '२': '@', '३': '#', '४': '$',
    '५': '%', '६': '^', '७': '&', '८': '*', '९': '(',

    # Punctuation
    '।': '|', '–': '–', '—': '—', '/': '÷',

    # Vowels
    'अ': 'c', 'आ': 'cf', 'इ': 'O{', 'ई': 'O{', 'उ': 'p', 'ऊ': 'pm',
    'ऋ': 'C', 'ए': 'P', 'ऐ': 'P]', 'ओ': 'cf]', 'औ': 'cf}',

    # Consonants
    'क': 's', 'ख': 'v', 'ग': 'u', 'घ': '3', 'ङ': 'ª',
    'च': 'r', 'छ': '5', 'ज': 'h', 'झ': 'H', 'ञ': '`',
    'ट': '6', 'ठ': '7', 'ड': '8', 'ढ': '9', 'ण': '0',
    'त': 't', 'थ': 'y', 'द': 'b', 'ध': 'w', 'न': 'g',
    'प': 'k', 'फ': 'km', 'ब': 'a', 'भ': 'e', 'म': 'd',
    'य': 'o', 'र': '/', 'ल': 'n', 'व': 'j', 'श': 'z',
    'ष': 'i', 'स': ';', 'ह': 'x',

    # Matras
    'ा': 'f',
    'ी': 'L',
    'ु': "'",
    'ू': '"',
    'ृ': '[',
    'े': ']',
    'ै': '}',
    'ो': 'f]',
    'ौ': 'f}',
    'ं': 'F',
    'ँ': 'F',
    'ः': ':',
    '्': '\\',
}

SPECIAL_CONJUNCTS = [
    (r'त्र', 'q'),
    (r'ज्ञ', '1'),
    (r'क्ष', '5'),
    (r'श्र', '>'),
    (r'द्ध', '4'),
    (r'द्य', 'B'),
    (r'त्त', 'Q'),
    (r'क्त', 'Qm'),
    (r'द्द', '2'),
    (r'ट्ट', '6'),
    (r'ठ्ठ', '7'),
    (r'ड्ड', '8'),
    (r'ड्ढ', '9'),
    (r'ह्र', 'x|'),
    (r'ह्न', 'X'),
    (r'हृ', 'x['),
    (r'द्व', 'å'),
    (r'ष्ट', 'i6'),
    (r'ष्ठ', 'i7'),
    (r'ङ्ग', 'ªg'),
    (r'ॐ', 'ç'),
]

def to_preeti(text: str) -> str:
    if not text:
        return ""

    import unicodedata
    s = unicodedata.normalize('NFC', text)

    # Convert numbers
    num_map = {
        '०': ')', '१': '!', '२': '@', '३': '#', '४': '$',
        '५': '%', '६': '^', '७': '&', '८': '*', '९': '(',
    }
    for u, p in num_map.items():
        s = s.replace(u, p)

    # Special conjuncts
    for pattern, rep in SPECIAL_CONJUNCTS:
        s = re.sub(pattern, rep, s)

    # Reph: र् before consonant -> Consonant + '{'
    s = re.sub(r'र्([क-हq15>4BQ26789Xå][ािीुूेैोौूंँ]*)', r'\1{', s)

    # Chhoti I (ि): Consonant + ि -> 'l' + Consonant
    s = re.sub(r'([क-हq15>4BQ26789Xå](?:्[क-हq15>4BQ26789Xå])*)ि', r'l\1', s)

    # Rakar: Consonant + ् + र -> Consonant + '|'
    s = re.sub(r'([क-ह])्\s*र', r'\1|', s)

    # Character replacement
    chars = []
    for ch in s:
        chars.append(UNICODE_TO_PREETI_CHARS.get(ch, ch))

    return "".join(chars)
