DB_USER = 'postgres'
DB_PASSWORD = 'postgres'
DB_HOST = 'localhost'
DB_PORT = '5432'
# DB_HOST = '172.104.141.250'
# DB_USER = 'postgres'
# DB_PASSWORD = 'postpndgres7%6'  # 'postpndgres7%6', 'postgres'
# DB_PORT = 5432
CONNECTION_KEY_TESTS = {
    'DEFAULT': {
        'DB_KEY': 'default',
        'APPS': ['digitalarz'],
        'MODELS': [],
        'TABLES': []
    },
    'SPATIAL_ADMIN': {
        'DB_KEY': 'ferrp_admin',
        'APPS': ['spatial_admin'],
        'MODELS': [],
        'TABLES': []
    },
    'SPATIAL_DS': {
        'DB_KEY': 'spatialds',
        'APPS': ['spatial_ds'],
        'MODELS': [],
        'TABLES': []
    },
}
