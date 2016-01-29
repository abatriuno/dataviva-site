# -*- coding: utf-8 -*-
from flask import Blueprint, render_template, g
from dataviva.apps.general.views import get_locale
from dataviva.api.attrs.models import Cnae, Cbo
from dataviva.api.rais.models import Yi , Ybi, Yio
from dataviva import db
from sqlalchemy import func, desc


mod = Blueprint('industry', __name__,
                template_folder='templates',
                url_prefix='/<lang_code>/industry',
                static_folder='static')


@mod.url_value_preprocessor
def pull_lang_code(endpoint, values):
    g.locale = values.pop('lang_code')


@mod.url_defaults
def add_language_code(endpoint, values):
    values.setdefault('lang_code', get_locale())


@mod.route('/')
def index():
 
    bra_id = '4mg' # localidade Minas Gerais 
    cnae_id = 'g'
    industry = {}

    industry = { 
        'industry_name': unicode('Supermercados', 'utf8'), 
        'location' : True ,
        'class' : True,
        'year' : 2010,
        'background_image':  unicode("'static/img/bg-profile-location.jpg'", 'utf8'),
        'portrait' : unicode('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7748245.803118934!2d-49.94643868147362!3d-18.514293729997753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa690a165324289%3A0x112170c9379de7b3!2sMinas+Gerais!5e0!3m2!1spt-BR!2sbr!4v1450524997110', 'utf8') ,
        
        'average_monthly_income' : 371,
        'salary_mass' : 17.9,
        'total_jobs' : 6.8, 
        'total_establishments' : 6.8,
        'rca_domestic' : 6.8,
        'distance' : 75.3,
        'opportunity_gain' : 17.9,

        'occupation_max_number_jobs_name' : unicode('Ministério de Ferro', 'utf8'),
        'occupation_max_number_jobs_value' : 12.2,
        'county_max_number_jobs_name' : unicode('China', 'utf8'),
        'county_max_number_jobs_value' : 8.82,
        'occupation_max_monthly_income_name' : unicode('Ministério de Ferro 2', 'utf8'),            
        'occupation_max_monthly_income_value' : 29.3,
        'county_max_monthly_income_name' : unicode('China2', 'utf8'),
        'county_max_monthly_income_value' : 11, 
        'text_profile' : unicode('Texto de perfil para Supermercados.', 'utf8'),
        'text_salary_job' : unicode('Texto para Salários e empregos', 'utf8'),
        'text_economic_opportunity' : unicode('Texto para Oportunidades Econômicas', 'utf8'),
        'county' : True
    }

    # É Brasil, retira alguns campos     
    industry['location'] = False

    #trata municipio
    if len(bra_id) == 4 : 
        industry['contry'] = False
    else :
        industry['contry'] = True    

    #Se for uma classe aparece oportunidades economicas no menu 
    if len(cnae_id) == 1 : 
        industry['class'] = True
    else : 
        industry['class'] = False

    

    ####EXTRACTY   

    #subquery do ano máximo Cnae  com localidade igual a Brasil
    yi_max_year = db.session.query(func.max(Yi.year)).filter_by(cnae_id=cnae_id)
    industry['year'] = yi_max_year.scalar() 

    #Pega o nome da atividade economica
    industry['industry_name'] = Cnae.query.filter_by(id=cnae_id).one().name()

    #Pegar Headers
    headers_generator = Yi.query.filter(
        Yi.cnae_id == cnae_id,
        Yi.year == yi_max_year    
        ).values(Yi.wage, Yi.num_jobs, Yi.num_est, Yi.wage_avg )


    for  wage, num_jobs, num_est, wage_avg in headers_generator:        
        industry['average_monthly_income'] = wage_avg
        industry['salary_mass'] = wage
        industry['total_jobs'] = num_jobs
        industry['total_establishments'] = num_est



    return render_template('industry/index.html', body_class='perfil-estado', context=industry)





