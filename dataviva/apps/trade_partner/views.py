# -*- coding: utf-8 -*-
from flask import Blueprint, render_template, g, request, abort
from dataviva.apps.general.views import get_locale
from dataviva.api.secex.services import TradePartner, TradePartnerMunicipalities, TradePartnerProducts
from dataviva.api.secex.models import Ymw, Ymbw
from dataviva.api.attrs.models import Wld, Bra
from dataviva import db
from sqlalchemy.sql.expression import func
from dataviva.translations.dictionary import dictionary
from os import walk
import os

mod = Blueprint('trade_partner', __name__,
                template_folder='templates',
                url_prefix='/<lang_code>/trade_partner')

trade_partner_tabs_path = os.path.join(mod.root_path, mod.template_folder, mod.name)
filenames = [filename for filename in next(os.walk(trade_partner_tabs_path))[2] if "graphs" in filename]
trade_partner_tabs = [tabs[tabs.find('-')+1:tabs.find('.')] for tabs in filenames]
trade_partner_tabs.append(None)


@mod.before_request
def before_request():
    g.page_type = 'category'


@mod.url_value_preprocessor
def pull_lang_code(endpoint, values):
    g.locale = values.pop('lang_code')


@mod.url_defaults
def add_language_code(endpoint, values):
    values.setdefault('lang_code', get_locale())


@mod.route('/<wld_id>/graphs/<tab>', methods=['POST'])
def graphs(wld_id, tab):
    trade_partner = Wld.query.filter_by(id=wld_id).first_or_404()
    location = Bra.query.filter_by(id=request.args.get('bra_id')).first()
    return render_template('trade_partner/graphs-'+tab+'.html', trade_partner=trade_partner, location=location)


@mod.route('/<wld_id>', defaults={'tab': None})
@mod.route('/<wld_id>/<tab>')
def index(wld_id, tab):

    bra_id = request.args.get('bra_id')
    trade_partner = Wld.query.filter_by(id=wld_id).first_or_404()
    location = Bra.query.filter_by(id=bra_id).first()
    max_year_query = db.session.query(
        func.max(Ymw.year)).filter_by(wld_id=wld_id)

    if bra_id:
        trade_partner_service = TradePartner(wld_id, bra_id)
        municipalities_service = TradePartnerMunicipalities(wld_id, bra_id)
        products_service = TradePartnerProducts(wld_id, bra_id)

        export_rank_query = Ymbw.query.join(Wld).filter(
            Ymbw.wld_id_len == len(wld_id),
            Ymbw.bra_id == bra_id,
            Ymbw.month == 0,
            Ymbw.year == max_year_query).order_by(Ymbw.export_val.desc())

        import_rank_query = Ymbw.query.join(Wld).filter(
            Ymbw.wld_id_len == len(wld_id),
            Ymbw.bra_id == bra_id,
            Ymbw.month == 0,
            Ymbw.year == max_year_query).order_by(Ymbw.import_val.desc())
    else:
        trade_partner_service = TradePartner(wld_id, None)
        municipalities_service = TradePartnerMunicipalities(wld_id, None)
        products_service = TradePartnerProducts(wld_id, None)

        export_rank_query = Ymw.query.join(Wld).filter(
            Ymw.wld_id_len == len(wld_id),
            Ymw.month == 0,
            Ymw.year == max_year_query).order_by(Ymw.export_val.desc())

        import_rank_query = Ymw.query.join(Wld).filter(
            Ymw.wld_id_len == len(wld_id),
            Ymw.month == 0,
            Ymw.year == max_year_query).order_by(Ymw.import_val.desc())

    export_rank = export_rank_query.all()
    import_rank = import_rank_query.all()

    if not bra_id:
        header = {
            'continent_id': wld_id[0:2],
            'name': trade_partner_service.country_name(),
            'year': trade_partner_service.year(),
            'trade_balance': trade_partner_service.trade_balance(),
            'total_exported': trade_partner_service.total_exported(),
            'unity_weight_export_price': trade_partner_service.unity_weight_export_price(),
            'total_imported': trade_partner_service.total_imported(),
            'unity_weight_import_price': trade_partner_service.unity_weight_import_price(),
            'wld_id': wld_id,
            'bra_id': bra_id
        }

    else:
        header = {
            'continent_id': wld_id[0:2],
            'name': trade_partner_service.country_name(),
            'year': trade_partner_service.year(),
            'trade_balance': trade_partner_service.trade_balance(),
            'total_exported': trade_partner_service.total_exported(),
            'unity_weight_export_price': trade_partner_service.unity_weight_export_price(),
            'total_imported': trade_partner_service.total_imported(),
            'unity_weight_import_price': trade_partner_service.unity_weight_import_price(),
            'wld_id': wld_id,
            'bra_id': bra_id,
            'location_name': trade_partner_service.location_name(),
            'location_type': dictionary()['bra_'+str(len(bra_id))]
        }

    body = {
        'municipality_with_more_exports': municipalities_service.municipality_with_more_exports(),
        'municipality_with_more_exports_state': municipalities_service.municipality_with_more_exports_state(),
        'highest_export_value': municipalities_service.highest_export_value(),
        'municipality_with_more_imports': municipalities_service.municipality_with_more_imports(),
        'municipality_with_more_imports_state': municipalities_service.municipality_with_more_imports_state(),
        'highest_import_value': municipalities_service.highest_import_value(),

        'product_with_more_imports': products_service.product_with_more_imports(),
        'product_with_highest_import_value': products_service.highest_import_value(),
        'product_with_more_exports': products_service.product_with_more_exports(),
        'product_with_highest_export_value': products_service.highest_export_value(),
        'product_with_highest_balance': products_service.product_with_highest_balance(),
        'highest_balance': products_service.highest_balance(),
        'product_with_lowest_balance': products_service.product_with_lowest_balance(),
        'lowest_balance': products_service.lowest_balance()
    }

    for index, trade_partner_ranking in enumerate(export_rank):
        if export_rank[index].wld_id == wld_id:
            header['export_rank'] = index + 1
            break

    for index, trade_partner_ranking in enumerate(import_rank):
        if import_rank[index].wld_id == wld_id:
            header['import_rank'] = index + 1
            break
    secex_max_year = db.session.query(func.max(Ymw.year)).filter(
        Ymw.month == 12).first()[0]

    if body['highest_export_value'] is None and body['highest_import_value'] is None:
        abort(404)
    if secex_max_year != header['year']:
        abort(404)
    else:
        if tab not in trade_partner_tabs:
            abort(404)

    graph = request.values.to_dict()
    
    if graph.has_key('bra_id'):
        graph.pop('bra_id')

    if graph != {}:
        graph = {
            'menu': graph.keys()[0] + '-' + graph.values()[0].split('/')[0],
            'url': graph.values()[0],
        }
    
    return render_template('trade_partner/index.html', body_class='perfil-estado', header=header, body=body, trade_partner=trade_partner, location=location, tab=tab, graph=graph)
