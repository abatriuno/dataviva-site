var lang = document.documentElement.lang,
    API_DOMAIN = 'http://api.staging.dataviva.info';

var ID_LABELS = {
    'municipality': 'ibge_id',
    'state': 'ibge_id',
    'region': 'ibge_id',
    'mesoregion': 'ibge_id',
    'microregion': 'ibge_id',
    'health_region': 'id',
    'product': 'hs_id',
    'product_chapter': 'hs_id',
    'product_section': 'hs_id',
    'country': 'wld_id',
    'continent': 'wld_id',
    'unit_type': 'id',
    'provider_type': 'id',
    'occupation_family': 'cbo_id',
    'occupation_group': 'cbo_id',
    'equipment_type': 'id',
    'equipment_code': 'id',
    'industry_class': 'cnae_id',
    'industry_section': 'cnae_id',
    'industry_division': 'cnae_id',
};

var DICT = {
    'secex': {
        'kg': {
            'export': 'export_kg',
            'import': 'import_kg'
        },
        'value': {
            'export': 'exports',
            'import': 'imports'
        },
        'value_per_kg': {
            'export': 'export_val_kg',
            'import': 'import_val_kg'
        }
    },
    'rais': {
        'jobs': 'total_jobs'
    }
};

var DEPTHS = {
    'secex': {
        'municipality': ['region', 'state', 'mesoregion', 'microregion', 'municipality'],
        'product': ['product_section', 'product'],
        'country': ['continent', 'country'],
        'port': ['port']
    },
    'rais': {
        'industry_class': ['industry_section', 'industry_division', 'industry_class'],
        'municipality': ['region', 'state', 'mesoregion', 'microregion', 'municipality'],
        'occupation_family': ['occupation_group', 'occupation_family']
    },
    'cnes_establishment': {
       'municipality': ['region', 'state', 'mesoregion', 'microregion', 'health_region', 'municipality'],
       'unit_type': ['provider_type', 'unit_type'],
   },
   'cnes_equipment': {
        'equipment_type': ['health_region', 'equipment_type', 'unit_type', 'equipment_code', 'equipment_type'],
        'municipality': ['health_region', 'equipment_type', 'equipment_code', 'unit_type'],
        'unit_type': ['health_region', 'equipment_type', 'equipment_code']
   },
    'cnes_bed': {
        'municipality': ['region', 'state', 'mesoregion', 'microregion', 'health_region', 'municipality'],
        'unit_type': ['provider_type', 'unit_type'],
        'bed_type': ['health_region', 'bed_type_per_specialty']
   },
   'cnes_professional': {
        'municipality': ['region', 'state', 'mesoregion', 'microregion', 'health_region', 'municipality']
   },
   'hedu': {
        'hedu_course': ['hedu_course_field', 'hedu_course']
   }
};

var SIZES = {
    'secex': {
        'municipality': ['value', 'kg'],
        'product': ['value', 'kg'],
        'country': ['value', 'kg'],
        'port': ['value', 'kg']
    },
    'rais': {
        'industry_class': ['jobs', 'wage', 'establishment_count'],
        'municipality': ['jobs', 'wage', 'establishment_count'],
        'occupation_family': ['jobs', 'wage']
    },
    'cnes_establishment': {
        'municipality': ['establishments'],
        'health_region': ['establishments'],
        'state': ['establishments'],
        'provider_type': ['establishments'],
        'unit_type': ['establishments'],
        'administrative_sphere': ['establishments']
    },
    'cnes_equipment': {
        'municipality': ['equipment_quantity', 'equipment_quantity_in_use'],
        'equipment_type': ['equipment_quantity', 'equipment_quantity_in_use']
    },
    'cnes_bed': {
        'bed_type': ['beds', 'number_sus_bed', 'number_non_sus_bed'],
        'municipality': ['beds', 'number_sus_bed', 'number_non_sus_bed'],
        'unit_type': ['beds', 'number_sus_bed', 'number_non_sus_bed'],
        'provider_type': ['beds', 'number_sus_bed', 'number_non_sus_bed', 'number_existing_contract']
   },
    'cnes_professional': {
        'municipality': ['professionals'],
        'unit_type': ['professionals'],
        'occupation_family': ['professionals', 'other_hours_worked', 'hospital_hour', 'ambulatory_hour']
    },
    'hedu': {
        'hedu_course': ['graduates', 'entrants']
   }
};

var FILTERS = {
    'secex': {},
    'rais': {},
    'cnes_establishment': {
        'municipality': [],
        'administrative_sphere': ['sus_bond'],
        'provider_type': [],
        'unit_type': [],
    },
    'cnes_equipment': {},
    'cnes_professional': {},
    'cnes_bed': {}
};

var COLORS = {
    'provider_type': {
        '30': '#4575B4',
        '40': '#74ADD1',
        '50': '#ABD9E9',
        '61': '#E0F3F8',
        '80': '#F46D43',
        '20': '#D73027',
        '22': '#FDAE61',
        '60': '#FEE090',
        '99': '#FFFFBF'
    },
    'region': {
        '1': '#00994c',
        '2': '#101070',
        '3': '#c40008',
        '4': '#a9d046',
        '5': '#f3e718'
    },
    'product_section': {
        '01': '#FFE999',
        '02': '#FFC41C',
        '03': '#E0902F',
        '04': '#D1FF00',
        '05': '#330000',
        '06': '#E377C2',
        '07': '#f7b6d2',
        '08': '#98df8a',
        '09': '#B00000',
        '10': '#b7834b',
        '11': '#105B10',
        '12': '#3ab11a',
        '13': '#D66011',
        '14': '#752277',
        '15': '#5E1F05',
        '16': '#17BCEF',
        '17': '#9edae5',
        '18': '#AA1F61',
        '19': '#A4BD99',
        '20': '#7F7F7F',
        '21': '#93789E',
        '22': '#C7C7C7'
    },
    'occupation_group': {
        '0': '#A4BD99',
        '1': '#752277',
        '2': '#cc0000',
        '3': '#d66011',
        '4': '#b7834b',
        '5': '#17bcef',
        '6': '#105B10',
        '7': '#9edae5',
        '8': '#ffc41c',
        '9': '#581f05',
        'x': '#C7C7C7'
    }
};

var BASIC_VALUES = {
    'secex': ['value', 'kg'],
    'rais': ['jobs', 'wage', 'average_wage', 'establishment_count', 'average_establishment_size'],
    'cnes_establishment': ['establishments'],
    'cnes_equipment': ['equipment_quantity', 'equipment_quantity_in_use'],
    'cnes_bed': ['beds'],
    'cnes_professional': ['professionals', 'other_hours_worked', 'hospital_hour', 'ambulatory_hour']
};

if (document.getElementById('rings'))
    BASIC_VALUES['secex'] = ['exports_value', 'exports_weight', 'imports_value', 'imports_weight']

var CALC_BASIC_VALUES = {
    'secex': {
        'exports_per_weight': function(dataItem) {
            return getUrlArgs()['type'] == 'export' ? dataItem['value'] / dataItem['kg'] : undefined;
        },
        'imports_per_weight': function(dataItem) {
            return getUrlArgs()['type'] == 'import' ? dataItem['value'] / dataItem['kg'] : undefined;
        }
    },
    'rais': {},
    'cnes_establishment': {},
    'cnes_equipment': {},
    'cnes_bed': {},
    'cnes_professional': {}
};

var HAS_ICONS = ['continent', 'industry_section', 'product_section', 'occupation_group'];

// Temporarily translates text until dictionary is updated
dictionary['export'] = lang == 'en' ? 'Exports (USD)' : 'Exportações (USD)';
dictionary['import'] = lang == 'en' ? 'Imports (USD)' : 'Importações (USD)';
dictionary['exports'] = lang == 'en' ? 'Exports (USD)' : 'Exportações (USD)';
dictionary['imports'] = lang == 'en' ? 'Imports (USD)' : 'Importações (USD)';
dictionary['trade_value'] = lang == 'en' ? 'Trade Value (USD)' : 'Valor do Comércio (USD)';
dictionary['state'] = lang == 'en' ? 'State' : 'Estado';
dictionary['plural_state'] = lang == 'en' ? 'States' : 'Estados';
dictionary['municipality'] = lang == 'en' ? 'Municipality' : 'Município';
dictionary['plural_municipality'] = lang == 'en' ? 'Municipalities' : 'Municípios';
dictionary['product_section'] = lang == 'en' ? 'Section' : 'Seção';
dictionary['product'] = lang == 'en' ? 'Product' : 'Produto';
dictionary['data_provided_by'] = lang == 'en' ? 'Data provided by' : 'Dados fornecidos por';
dictionary['by'] = lang == 'en' ? 'by' : 'por';
dictionary['that trade'] = lang == 'en' ? 'that trade' : 'que comercializam';
dictionary['of'] = lang == 'en' ? 'of' : 'de';
dictionary['number of'] = lang == 'en' ? 'number of' : 'número de';
dictionary['port'] = lang == 'en' ? 'Port' : 'Porto';
dictionary['country'] = lang == 'en' ? 'Country' : 'País';
dictionary['plural_country'] = lang == 'en' ? 'Countries' : 'Países';
dictionary['continent'] = lang == 'en' ? 'Continent' : 'Continente';
dictionary['plural_continent'] = lang == 'en' ? 'Continents' : 'Continentes';
dictionary['mesoregion'] = lang == 'en' ? 'Mesoregion' : 'Mesorregião';
dictionary['plural_mesoregion'] = lang == 'en' ? 'Mesoregions' : 'Mesorregiões';
dictionary['microregion'] = lang == 'en' ? 'Microregion' : 'Microrregião';
dictionary['plural_microregion'] = lang == 'en' ? 'Microregions' : 'Microrregiões';
dictionary['region'] = lang == 'en' ? 'Region' : 'Região';
dictionary['plural_region'] = lang == 'en' ? 'Regions' : 'Regiões';
dictionary['basic_values'] = lang == 'en' ? 'Basic Values' : 'Valores Básicos';
dictionary['market_share'] = lang == 'en' ? 'Market Share' : 'Participação de Mercado';
dictionary['item_id'] = 'ID';
dictionary['ibge_id'] = lang == 'en' ? 'IBGE ID' : 'ID IBGE';
dictionary['per'] = lang == 'en' ? 'per' : 'por';
dictionary['exports_value'] = lang == 'en' ? 'Export Value' : 'Valor das Exportações';
dictionary['imports_value'] = lang == 'en' ? 'Import Value' : 'Valor das Importações';
dictionary['exports_weight'] = lang == 'en' ? 'Export Weight' : 'Peso das Exportações';
dictionary['imports_weight'] = lang == 'en' ? 'Import Weight' : 'Peso das Importações';
dictionary['imports_per_weight'] = lang == 'en' ? 'Imports per kg' : 'Importações por peso';
dictionary['exports_per_weight'] = lang == 'en' ? 'Exports per kg' : 'Exportações por peso';
dictionary['industry_section'] = lang == 'en' ? 'Section' : 'Seção';
dictionary['industry_division'] = lang == 'en' ? 'Division' : 'Divisão';
dictionary['establishment_count'] = lang == 'en' ? 'Total Establishments' : 'Total de Estabelecimentos';
dictionary['wage'] = lang == 'en' ? 'Total Monthly Wages' : 'Renda Mensal Total';
dictionary['average_wage'] = lang == 'en' ? 'Average Monthly Wages' : 'Renda Mensal Média';
dictionary['industry_class'] = lang == 'en' ? 'Class' : 'Classe';
dictionary['total_jobs'] = lang == 'en' ? 'Total Jobs' : 'Total de Empregos';
dictionary['average_establishment_size'] = lang == 'en' ? 'Jobs per Establishment' : 'Empregos por Estabelecimento';
dictionary['occupation_family'] = lang == 'en' ? 'Family' : 'Família';
dictionary['occupation_group'] = lang == 'en' ? 'Main Group' : 'Grande Grupo';
dictionary['establishments'] = lang == 'en' ? 'Total Establishments' : 'Total de Estabelecimentos';
dictionary['Creating URL'] = lang == 'en' ? 'Creating URL' : 'Criando URL';
dictionary['drawer_group'] = lang == 'en' ? 'Group' : 'Agrupar';
dictionary['yes'] = lang == 'en' ? 'Yes' : 'Sim';
dictionary['no'] = lang == 'en' ? 'No' : 'Não';
dictionary['drawer_filter'] = lang == 'en' ? 'Filter' : 'Filtrar';
dictionary['including'] = lang == 'en' ? 'Including' : 'Inclui';
dictionary['Filter by'] = lang == 'en' ? 'Filter by' : 'Filtrar por';
dictionary['kg'] = 'KG';
dictionary['id'] = 'ID';
dictionary['establishment_size'] = lang == 'en' ? 'Establishment Size' : 'Tamanho do Estabelecimento';
dictionary['average_establishment_size'] = lang == 'en' ? 'Average Establishment Size' : 'Tamanho Médio do Estabelecimento';
dictionary['establishment_count'] = lang == 'en' ? 'Establishments' : 'Estabelecimentos';
dictionary['wage'] = lang == 'en' ? 'Salary Mass' : 'Massa Salarial';
dictionary['gender'] = lang == 'en' ? 'Gender' : 'Gênero';
dictionary['ethnicity'] = lang == 'en' ? 'Ethnicity' : 'Etnia';
dictionary['literacy'] = lang == 'en' ? 'Literacy' : 'Escolaridade';
dictionary['month'] = lang == 'en' ? 'Month' : 'Mês';
dictionary['port'] = lang == 'en' ? 'Port' : 'Porto';
dictionary['legal_nature'] = lang == 'en' ? 'Legal Nature' : 'Natureza Jurídica';
dictionary['size_establishment'] = lang == 'en' ? 'Establishment Size' : 'Tamanho do Estabelecimento';
dictionary['time_resolution'] = lang == 'en' ? 'Time Resolution' : 'Resolução Temporal';
dictionary['total_of'] = lang == 'en' ? 'Total in selected years: ' : 'Total nos anos selecionados: ';
dictionary['data_provided_by'] = lang == 'en' ? "Data provided by " : "Dados fornecidos por ";
dictionary['percentage_terms'] = lang == 'en' ? 'Percentage Terms' : 'Termos Percentuais';
dictionary['values'] = lang == 'en' ? 'Values' : 'Valores';
dictionary['exporting_municipality'] = lang == 'en' ? 'Based on the Exporting Municipality' : 'Baseado nos Municípios Exportadores';
dictionary['state_production'] = lang == 'en' ? 'Based on State Production' : 'Baseado nos Estados Produtores';
dictionary['average_wage'] = lang == 'en' ? 'Salário Médio Mensal' : 'Average Monthly Wage';
dictionary['jobs'] = lang == 'en' ? 'Jobs' : 'Empregos';
dictionary['year'] = lang == 'en' ? 'Year' : 'Ano';
dictionary['scale'] = lang == 'en' ? 'Scale' : 'Escala';
dictionary['yaxis'] = lang == 'en' ? 'Y-Axis' : 'Eixo Y';
dictionary['xaxis'] = lang == 'en' ? 'X-Axis' : 'Eixo X';
dictionary['locale'] = lang == 'en' ? 'en_US' : 'pt_BR';
dictionary['secex'] = 'SECEX';
dictionary['rais'] = 'RAIS';
dictionary['hide'] = lang == 'en' ? 'Hide' : 'Ocultar';
dictionary['isolate'] = lang == 'en' ? 'Isolate' : 'Isolar';
dictionary['all'] = lang == 'en' ? 'All' : 'Todos';
dictionary['Unable to load visualization'] = lang == 'en' ? 'Unable to load visualization' : 'Não foi possível carregar a visualização';
dictionary['click for more info'] = lang == 'en' ? 'click for more info' : 'clique para ver mais';
dictionary['quantity'] = lang == 'en' ? 'Quantity' : 'Quantidade';

var titleBuilder = function(title, subtitle, attrs, dataset, filters, yearRange) {
    var formatYearRange = function() {
        if (yearRange[0] && yearRange[1])
            return '(' + yearRange[0] + '-' + yearRange[1] + ')';
        if (yearRange[1])
            return '(' + yearRange[1] + ')';
    };

    if (yearRange[0] || yearRange[1])
        title += ' ' + formatYearRange();

    for (attr in attrs) {
        title = title.replace('<' + attr + '>', dictionary['plural_' + attrs[attr]] || dictionary[attrs[attr]]);
    }
    title = title.charAt(0).toUpperCase() + title.slice(1);

    return {'title': title, 'subtitle': subtitle};
};

var getUrlArgs = function() {
    var args = {};
    if (window.location.search) {
        window.location.search.split('?')[1].split('&').forEach(function(arg) {
            args[arg.split('=')[0]] = arg.split('=')[1];
        });
    }
    return args;
};

var formatHelper = function() {
    var args = getUrlArgs();

    return {
        'locale': lang == 'pt' ? 'pt_BR' : 'en_US',
        'text': function(text, key) {
            switch (text) {
                case 'item_id':
                    return dictionary[DICT[dataset][text][squares]] || dictionary[text];
                case 'value':
                case 'kg':
                case 'value_per_kg':
                    return dictionary[DICT[dataset][text][args['type']]];
                case 'jobs':
                    return dictionary[DICT[dataset][text]];
                case 'primary connections':
                    return text.replace(/\w\S*/g, function(txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    })
                default:
                    return dictionary[text] || text;
            };

        },
        'number': function(value, opts) {
            var result;

            if (value.toString().split('.')[0].length > 3) {

                var symbol = d3.formatPrefix(value).symbol;
                symbol = symbol.replace('G', 'B');

                value = d3.formatPrefix(value).scale(value);
                value = parseFloat(d3.format('.3g')(value));

                if (symbol && lang === 'pt') {
                    var digit = parseFloat(value.toString().split('.')[0]);
                    switch (symbol) {
                        case 'T':
                            symbol = digit < 2 ? ' Trilh\u00e3o' : ' Trilh\u00f5es';
                            break;
                        case 'B':
                            symbol = digit < 2 ? ' Bilh\u00e3o' : ' Bilh\u00f5es';
                            break;
                        case 'M':
                            symbol = digit < 2 ? ' Milh\u00e3o' : ' Milh\u00f5es';
                            break;
                        case 'k':
                            symbol = ' Mil';
                    }
                }

                result = value + symbol;
            }

            if (!result) {
                result = d3.round(value, 3);
            }

            if (result > 0 && result < 1) {
                result = d3.round(result, 3);
            }

            switch (opts.key) {
                case 'share':
                    result = d3.round(value, 1) + '%';
                    break;
                case 'value':
                case 'imports_per_weight':
                case 'exports_per_weight':
                    result = '$' + result + ' USD';
                    break;
                case 'kg':
                    result += ' kg';
                    break;
                case 'average_wage':
                case 'wage':
                    result = '$' + result + ' BRL';
                    break;
                case 'jobs_per_establishments':
                    result = d3.round(value, 0)
                    break;
            };

            if (result && lang == 'pt') {
                var n = result.toString().split('.')
                n[0] = n[0].replace(',', '.')
                result = n.join(',')
            }

            return result || value;
        }
    }
};
