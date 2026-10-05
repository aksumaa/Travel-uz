"""TripMind domain evolution

Revision ID: 003_tripmind_evolution
Revises: 002_core_relational_schema
Create Date: 2026-10-05 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite, postgresql

revision: str = '003_tripmind_evolution'
down_revision: Union[str, None] = '002_core_relational_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. agency_verifications table
    op.create_table(
        'agency_verifications',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('agency_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(length=50), server_default='pending', nullable=False),
        sa.Column('business_registration_number', sa.String(length=100), nullable=True),
        sa.Column('license_number', sa.String(length=100), nullable=True),
        sa.Column('document_url', sa.String(length=500), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('reviewer_notes', sa.Text(), nullable=True),
        sa.Column('verified_by_user_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['agency_id'], ['agencies.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['verified_by_user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_agency_verifications_id'), 'agency_verifications', ['id'], unique=False)
    op.create_index(op.f('ix_agency_verifications_agency_id'), 'agency_verifications', ['agency_id'], unique=False)
    op.create_index(op.f('ix_agency_verifications_status'), 'agency_verifications', ['status'], unique=False)

    # 2. tour_images table
    op.create_table(
        'tour_images',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('package_id', sa.Integer(), nullable=False),
        sa.Column('image_url', sa.String(length=500), nullable=False),
        sa.Column('caption', sa.String(length=255), nullable=True),
        sa.Column('is_cover', sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column('order_index', sa.Integer(), server_default='0', nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['package_id'], ['packages.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tour_images_id'), 'tour_images', ['id'], unique=False)
    op.create_index(op.f('ix_tour_images_package_id'), 'tour_images', ['package_id'], unique=False)

    # 3. favorites table (universal multi-entity saved vault)
    op.create_table(
        'favorites',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('entity_type', sa.String(length=50), nullable=False),
        sa.Column('entity_id', sa.Integer(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('metadata_json', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'entity_type', 'entity_id', name='uq_user_favorite_entity')
    )
    op.create_index(op.f('ix_favorites_id'), 'favorites', ['id'], unique=False)
    op.create_index(op.f('ix_favorites_user_id'), 'favorites', ['user_id'], unique=False)
    op.create_index(op.f('ix_favorites_entity_type'), 'favorites', ['entity_type'], unique=False)
    op.create_index(op.f('ix_favorites_entity_id'), 'favorites', ['entity_id'], unique=False)

    # 4. Add columns to agencies
    with op.batch_alter_table('agencies') as batch_op:
        batch_op.add_column(sa.Column('website', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('telegram_channel', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('whatsapp', sa.String(length=100), nullable=True))

    # 5. Add columns to packages
    with op.batch_alter_table('packages') as batch_op:
        batch_op.add_column(sa.Column('availability', sa.JSON(), nullable=True))
        batch_op.add_column(sa.Column('min_group_size', sa.Integer(), server_default='1', nullable=False))
        batch_op.add_column(sa.Column('max_group_size', sa.Integer(), server_default='20', nullable=True))
        batch_op.add_column(sa.Column('languages', sa.JSON(), nullable=True))
        batch_op.add_column(sa.Column('itinerary_highlights', sa.JSON(), nullable=True))
        batch_op.add_column(sa.Column('is_featured', sa.Boolean(), server_default=sa.false(), nullable=False))
        batch_op.add_column(sa.Column('translations_json', sa.JSON(), nullable=True))

    # 6. Add columns to leads
    with op.batch_alter_table('leads') as batch_op:
        batch_op.add_column(sa.Column('client_email', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('client_phone', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('preferred_contact_method', sa.String(length=50), server_default='email', nullable=False))
        batch_op.add_column(sa.Column('package_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('trip_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('travelers_count', sa.Integer(), server_default='1', nullable=False))
        batch_op.add_column(sa.Column('travel_date', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('budget', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('currency', sa.String(length=10), server_default='USD', nullable=False))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=True))

    # 7. Add columns to trip_activities (TripItem evolution)
    with op.batch_alter_table('trip_activities') as batch_op:
        batch_op.add_column(sa.Column('item_type', sa.String(length=50), server_default='attraction', nullable=False))
        batch_op.add_column(sa.Column('currency', sa.String(length=10), server_default='USD', nullable=False))
        batch_op.add_column(sa.Column('latitude', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('longitude', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('is_verified', sa.Boolean(), server_default=sa.false(), nullable=False))
        batch_op.add_column(sa.Column('notes', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('details_json', sa.JSON(), nullable=True))

    # 8. Add columns to trips
    with op.batch_alter_table('trips') as batch_op:
        batch_op.add_column(sa.Column('preferences_json', sa.JSON(), nullable=True))
        batch_op.add_column(sa.Column('is_archived', sa.Boolean(), server_default=sa.false(), nullable=False))

    # 9. Add localized translation columns to destinations, places, categories
    with op.batch_alter_table('categories') as batch_op:
        batch_op.add_column(sa.Column('translations_json', sa.JSON(), nullable=True))

    with op.batch_alter_table('destinations') as batch_op:
        batch_op.add_column(sa.Column('translations_json', sa.JSON(), nullable=True))

    with op.batch_alter_table('places') as batch_op:
        batch_op.add_column(sa.Column('translations_json', sa.JSON(), nullable=True))

    # 10. Add package_id to reviews
    with op.batch_alter_table('reviews') as batch_op:
        batch_op.add_column(sa.Column('package_id', sa.Integer(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table('reviews') as batch_op:
        batch_op.drop_column('package_id')

    with op.batch_alter_table('places') as batch_op:
        batch_op.drop_column('translations_json')

    with op.batch_alter_table('destinations') as batch_op:
        batch_op.drop_column('translations_json')

    with op.batch_alter_table('categories') as batch_op:
        batch_op.drop_column('translations_json')

    with op.batch_alter_table('trips') as batch_op:
        batch_op.drop_column('is_archived')
        batch_op.drop_column('preferences_json')

    with op.batch_alter_table('trip_activities') as batch_op:
        batch_op.drop_column('details_json')
        batch_op.drop_column('notes')
        batch_op.drop_column('is_verified')
        batch_op.drop_column('longitude')
        batch_op.drop_column('latitude')
        batch_op.drop_column('currency')
        batch_op.drop_column('item_type')

    with op.batch_alter_table('leads') as batch_op:
        batch_op.drop_column('updated_at')
        batch_op.drop_column('currency')
        batch_op.drop_column('budget')
        batch_op.drop_column('travel_date')
        batch_op.drop_column('travelers_count')
        batch_op.drop_column('trip_id')
        batch_op.drop_column('package_id')
        batch_op.drop_column('preferred_contact_method')
        batch_op.drop_column('client_phone')
        batch_op.drop_column('client_email')

    with op.batch_alter_table('packages') as batch_op:
        batch_op.drop_column('translations_json')
        batch_op.drop_column('is_featured')
        batch_op.drop_column('itinerary_highlights')
        batch_op.drop_column('languages')
        batch_op.drop_column('max_group_size')
        batch_op.drop_column('min_group_size')
        batch_op.drop_column('availability')

    with op.batch_alter_table('agencies') as batch_op:
        batch_op.drop_column('whatsapp')
        batch_op.drop_column('telegram_channel')
        batch_op.drop_column('website')

    op.drop_table('favorites')
    op.drop_table('tour_images')
    op.drop_table('agency_verifications')
