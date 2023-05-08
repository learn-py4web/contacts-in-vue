"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *


def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()

db.define_table('contact',
                Field('contact_name'),
                Field('owner', default=get_user_email)
                )

db.define_table('phone_info',
                Field('phone_number'),
                Field('phone_type'),
                Field('contact_id', 'reference contact')
                )

db.commit()
