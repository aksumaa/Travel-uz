import sqlite3
import os

def sync_db(db_path):
    if not os.path.exists(db_path):
        return
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    def add_col_if_missing(table, col, col_type):
        cur.execute(f"PRAGMA table_info({table})")
        cols = [r[1] for r in cur.fetchall()]
        if col not in cols:
            print(f"Adding {col} to {table} in {db_path}")
            cur.execute(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}")
            conn.commit()

    # agencies
    for c, t in [("website", "VARCHAR(255)"), ("telegram_channel", "VARCHAR(255)"), ("whatsapp", "VARCHAR(100)")]:
        add_col_if_missing("agencies", c, t)

    # packages
    for c, t in [("availability", "JSON"), ("min_group_size", "INTEGER DEFAULT 1"), ("max_group_size", "INTEGER DEFAULT 20"),
                 ("languages", "JSON"), ("itinerary_highlights", "JSON"), ("is_featured", "BOOLEAN DEFAULT 0"),
                 ("translations_json", "JSON")]:
        add_col_if_missing("packages", c, t)

    # leads
    for c, t in [("client_email", "VARCHAR(255)"), ("client_phone", "VARCHAR(100)"), ("preferred_contact_method", "VARCHAR(50) DEFAULT 'email'"),
                 ("package_id", "INTEGER"), ("trip_id", "INTEGER"), ("travelers_count", "INTEGER DEFAULT 1"),
                 ("travel_date", "VARCHAR(50)"), ("budget", "FLOAT"), ("currency", "VARCHAR(10) DEFAULT 'USD'"),
                 ("updated_at", "DATETIME")]:
        add_col_if_missing("leads", c, t)

    # trip_activities
    for c, t in [("item_type", "VARCHAR(50) DEFAULT 'attraction'"), ("currency", "VARCHAR(10) DEFAULT 'USD'"),
                 ("latitude", "FLOAT"), ("longitude", "FLOAT"), ("is_verified", "BOOLEAN DEFAULT 0"),
                 ("notes", "TEXT"), ("details_json", "JSON")]:
        add_col_if_missing("trip_activities", c, t)

    # trips
    for c, t in [("preferences_json", "JSON"), ("is_archived", "BOOLEAN DEFAULT 0")]:
        add_col_if_missing("trips", c, t)

    # categories, destinations, places
    add_col_if_missing("categories", "translations_json", "JSON")
    add_col_if_missing("destinations", "translations_json", "JSON")
    add_col_if_missing("places", "translations_json", "JSON")

    # reviews
    add_col_if_missing("reviews", "package_id", "INTEGER")

    # tables: agency_verifications, tour_images, favorites
    cur.execute("""
    CREATE TABLE IF NOT EXISTS agency_verifications (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        agency_id INTEGER NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'pending' NOT NULL,
        business_registration_number VARCHAR(100),
        license_number VARCHAR(100),
        document_url VARCHAR(500),
        notes TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        reviewed_at DATETIME,
        reviewer_notes TEXT,
        verified_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
    )
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS tour_images (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        caption VARCHAR(255),
        is_cover BOOLEAN DEFAULT 0 NOT NULL,
        order_index INTEGER DEFAULT 0 NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER NOT NULL,
        notes TEXT,
        metadata_json JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        UNIQUE (user_id, entity_type, entity_id)
    )
    """)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    sync_db("backend/traveluz.db")
    sync_db("traveluz.db")
    print("Database sync complete!")
