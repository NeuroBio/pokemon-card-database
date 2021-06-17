import firebase_admin
from firebase_admin import firestore
from time import time

def hard_delete(args, context):
    try:
        firebase_app = firebase_admin.initialize_app()
    except:
        firebase_app = firebase_admin.get_app()

    firestore_client = firestore.client(app=firebase_app)

    # get expired deletion docs
    deadline = int(time() * 1000) - (12 * 60 * 60 * 1000)
    docs_to_delete = firestore_client.collection('pokemon-cards') \
        .where('deleted', '<', str(deadline)).get()

    #  delete expired documents
    for doc in docs_to_delete:
        docs_to_delete.delect(doc.reference)

    print(f"Successfully deleted {len(docs_to_delete)} documents.")
    return
