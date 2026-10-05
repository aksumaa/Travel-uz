"""Core relational schema

Revision ID: 002_core_relational_schema
Revises: 001_initial
Create Date: 2026-09-29 15:45:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '002_core_relational_schema'
down_revision: Union[str, None] = '001_initial'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # 1. Profiles
    op.create_table(
        'profiles',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('phone_number', sa.String(length=50), nullable=True),
        sa.Column('country', sa.String(length=100), server_default='Uzbekistan', nullable=True),
        sa.Column('preferred_currency', sa.String(length=10), server_default='USD', nullable=False),
        sa.Column('preferred_language', sa.String(length=10), server_default='en', nullable=False),
        sa.Column('travel_style', sa.String(length=100), server_default='Cultural Heritage', nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index(op.f('ix_profiles_id'), 'profiles', ['id'], unique=False)
    op.create_index(op.f('ix_profiles_user_id'), 'profiles', ['user_id'], unique=True)

    # 2. Categories
    op.create_table(
        'categories',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=120), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(length=100), server_default='landmark', nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_categories_name'), 'categories', ['name'], unique=True)
    op.create_index(op.f('ix_categories_slug'), 'categories', ['slug'], unique=True)
    op.create_index(op.f('ix_categories_id'), 'categories', ['id'], unique=False)

    # 3. Destinations
    op.create_table(
        'destinations',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=220), nullable=False),
        sa.Column('category_id', sa.Integer(), nullable=True),
        sa.Column('region', sa.String(length=150), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('budget_tier', sa.String(length=50), server_default='moderate', nullable=False),
        sa.Column('average_cost_per_day', sa.Float(), server_default='50.0', nullable=False),
        sa.Column('recommended_duration_days', sa.Integer(), server_default='3', nullable=False),
        sa.Column('best_season', sa.String(length=100), server_default='Spring & Autumn', nullable=False),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('gallery', sa.JSON(), nullable=True),
        sa.Column('is_featured', sa.Boolean(), server_default='0', nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_destinations_id'), 'destinations', ['id'], unique=False)
    op.create_index(op.f('ix_destinations_name'), 'destinations', ['name'], unique=False)
    op.create_index(op.f('ix_destinations_slug'), 'destinations', ['slug'], unique=True)
    op.create_index(op.f('ix_destinations_region'), 'destinations', ['region'], unique=False)
    op.create_index(op.f('ix_destinations_is_featured'), 'destinations', ['is_featured'], unique=False)

    # 4. Places
    op.create_table(
        'places',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('destination_id', sa.Integer(), nullable=False),
        sa.Column('category_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=280), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('opening_hours', sa.String(length=100), server_default='09:00 - 18:00', nullable=True),
        sa.Column('entry_fee', sa.Float(), server_default='0.0', nullable=False),
        sa.Column('currency', sa.String(length=10), server_default='USD', nullable=False),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['destination_id'], ['destinations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_places_id'), 'places', ['id'], unique=False)
    op.create_index(op.f('ix_places_name'), 'places', ['name'], unique=False)
    op.create_index(op.f('ix_places_slug'), 'places', ['slug'], unique=True)

    # 5. Saved Destinations
    op.create_table(
        'saved_destinations',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('destination_id', sa.Integer(), nullable=False),
        sa.Column('notes', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['destination_id'], ['destinations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'destination_id', name='uq_user_saved_destination')
    )

    # 6. Trips
    op.create_table(
        'trips',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('destination_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('destination', sa.String(length=255), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.Column('duration_days', sa.Integer(), server_default='3', nullable=False),
        sa.Column('estimated_budget', sa.Float(), server_default='0.0', nullable=False),
        sa.Column('currency', sa.String(length=10), server_default='USD', nullable=False),
        sa.Column('travelers_count', sa.Integer(), server_default='1', nullable=False),
        sa.Column('travel_style', sa.String(length=100), server_default='Cultural Heritage', nullable=False),
        sa.Column('status', sa.String(length=50), server_default='planned', nullable=False),
        sa.Column('is_public', sa.Boolean(), server_default='0', nullable=False),
        sa.Column('share_token', sa.String(length=64), nullable=False),
        sa.Column('content_json', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['destination_id'], ['destinations.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_trips_id'), 'trips', ['id'], unique=False)
    op.create_index(op.f('ix_trips_share_token'), 'trips', ['share_token'], unique=True)
    op.create_index(op.f('ix_trips_title'), 'trips', ['title'], unique=False)

    # 7. Trip Days
    op.create_table(
        'trip_days',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('trip_id', sa.Integer(), nullable=False),
        sa.Column('day_number', sa.Integer(), nullable=False),
        sa.Column('date', sa.Date(), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('daily_budget', sa.Float(), server_default='0.0', nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['trip_id'], ['trips.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_trip_days_id'), 'trip_days', ['id'], unique=False)

    # 8. Trip Activities
    op.create_table(
        'trip_activities',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('trip_day_id', sa.Integer(), nullable=False),
        sa.Column('place_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('location_name', sa.String(length=255), nullable=False),
        sa.Column('time_slot', sa.String(length=50), server_default='morning', nullable=False),
        sa.Column('time_start', sa.String(length=50), nullable=True),
        sa.Column('duration_hours', sa.Float(), server_default='1.5', nullable=False),
        sa.Column('estimated_cost', sa.Float(), server_default='0.0', nullable=False),
        sa.Column('order_index', sa.Integer(), server_default='0', nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['place_id'], ['places.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['trip_day_id'], ['trip_days.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_trip_activities_id'), 'trip_activities', ['id'], unique=False)

    # 9. Saved Trips
    op.create_table(
        'saved_trips',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('trip_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['trip_id'], ['trips.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'trip_id', name='uq_user_saved_trip')
    )

    # 10. Community Trips
    op.create_table(
        'community_trips',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('creator_user_id', sa.Integer(), nullable=False),
        sa.Column('trip_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('destination', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('max_participants', sa.Integer(), server_default='10', nullable=False),
        sa.Column('current_participants_count', sa.Integer(), server_default='1', nullable=False),
        sa.Column('estimated_cost_per_person', sa.Float(), server_default='0.0', nullable=False),
        sa.Column('currency', sa.String(length=10), server_default='USD', nullable=False),
        sa.Column('status', sa.String(length=50), server_default='open', nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['creator_user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['trip_id'], ['trips.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_community_trips_id'), 'community_trips', ['id'], unique=False)
    op.create_index(op.f('ix_community_trips_status'), 'community_trips', ['status'], unique=False)

    # 11. Trip Participants
    op.create_table(
        'trip_participants',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('community_trip_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(length=50), server_default='pending', nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('joined_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['community_trip_id'], ['community_trips.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('community_trip_id', 'user_id', name='uq_community_trip_participant')
    )

    # 12. Friend Requests
    op.create_table(
        'friend_requests',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('sender_id', sa.Integer(), nullable=False),
        sa.Column('receiver_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(length=50), server_default='pending', nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('sender_id', 'receiver_id', name='uq_friend_request_pair')
    )

    # 13. Conversations
    op.create_table(
        'conversations',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('participant_one_id', sa.Integer(), nullable=False),
        sa.Column('participant_two_id', sa.Integer(), nullable=False),
        sa.Column('last_message_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['participant_one_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['participant_two_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 14. Messages
    op.create_table(
        'messages',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('conversation_id', sa.Integer(), nullable=False),
        sa.Column('sender_id', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), server_default='0', nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 15. Guides
    op.create_table(
        'guides',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('bio', sa.Text(), nullable=False),
        sa.Column('languages', sa.String(length=255), server_default='Uzbek, English, Russian', nullable=False),
        sa.Column('cities_covered', sa.String(length=255), server_default='Samarkand, Bukhara', nullable=False),
        sa.Column('experience_years', sa.Integer(), server_default='3', nullable=False),
        sa.Column('daily_rate', sa.Float(), server_default='60.0', nullable=False),
        sa.Column('currency', sa.String(length=10), server_default='USD', nullable=False),
        sa.Column('rating', sa.Float(), server_default='5.0', nullable=False),
        sa.Column('reviews_count', sa.Integer(), server_default='0', nullable=False),
        sa.Column('is_verified', sa.Boolean(), server_default='1', nullable=False),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('contact_phone', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )

    # 16. Agency Services
    op.create_table(
        'agency_services',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('agency_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price', sa.Float(), server_default='0.0', nullable=False),
        sa.Column('currency', sa.String(length=10), server_default='USD', nullable=False),
        sa.Column('service_type', sa.String(length=100), server_default='Transport', nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['agency_id'], ['agencies.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 17. Reviews
    op.create_table(
        'reviews',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('destination_id', sa.Integer(), nullable=True),
        sa.Column('place_id', sa.Integer(), nullable=True),
        sa.Column('guide_id', sa.Integer(), nullable=True),
        sa.Column('agency_id', sa.Integer(), nullable=True),
        sa.Column('rating', sa.Integer(), server_default='5', nullable=False),
        sa.Column('comment', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['agency_id'], ['agencies.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['destination_id'], ['destinations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['guide_id'], ['guides.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['place_id'], ['places.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 18. Notifications
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), server_default='0', nullable=False),
        sa.Column('action_url', sa.String(length=500), nullable=True),
        sa.Column('entity_type', sa.String(length=50), nullable=True),
        sa.Column('entity_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notifications_is_read'), 'notifications', ['is_read'], unique=False)

    # 19. Reports
    op.create_table(
        'reports',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('reporter_user_id', sa.Integer(), nullable=False),
        sa.Column('target_type', sa.String(length=50), nullable=False),
        sa.Column('target_id', sa.Integer(), nullable=False),
        sa.Column('reason', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=50), server_default='pending', nullable=False),
        sa.Column('resolution_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['reporter_user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # 20. Admin Actions
    op.create_table(
        'admin_actions',
        sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
        sa.Column('admin_user_id', sa.Integer(), nullable=False),
        sa.Column('action_type', sa.String(length=100), nullable=False),
        sa.Column('target_type', sa.String(length=50), nullable=False),
        sa.Column('target_id', sa.Integer(), nullable=False),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['admin_user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('admin_actions')
    op.drop_table('reports')
    op.drop_table('notifications')
    op.drop_table('reviews')
    op.drop_table('agency_services')
    op.drop_table('guides')
    op.drop_table('messages')
    op.drop_table('conversations')
    op.drop_table('friend_requests')
    op.drop_table('trip_participants')
    op.drop_table('community_trips')
    op.drop_table('saved_trips')
    op.drop_table('trip_activities')
    op.drop_table('trip_days')
    op.drop_table('trips')
    op.drop_table('saved_destinations')
    op.drop_table('places')
    op.drop_table('destinations')
    op.drop_table('categories')
    op.drop_table('profiles')
