"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_user_email

url_signer = URLSigner(session)

@action('index')
@action.uses('index.html', db, auth.user, url_signer)
def index():
    return dict(
        # COMPLETE: return here any signed URLs you need.
        get_contacts_url = URL('get_contacts', signer=url_signer),
        create_contact_url = URL('create_contact', signer=url_signer),
    )

@action('get_contacts', method="GET")
@action.uses(session, auth.user, url_signer.verify())
def get_contacts():
    contacts = db(db.contact.owner == get_user_email()).select().as_list()
    # contacts = [dict(id=1, contact_name="Luca de Alfaro", contact_owner="luca@ucsc.edu")]
    return dict(contacts=contacts)

@action('create_contact', method="POST")
@action.uses(auth.user, url_signer.verify(), db)
def create_contact():
    id = db.contact.insert(contact_name = request.params.contact_name)
    return dict(contact=dict(
        id=id,
        contact_name=request.params.contact_name,
        contact_owner=get_user_email(),
    ))

@action('create_phone', method="POST")
@action.uses(auth.user, url_signer.verify(), db)
def create_phone():
    id = db.phone_info.insert(
        contact_id = request.params.contact_id,
        phone_name = request.params.phone_name,
        phone_number = request.params.phone_number,
    )