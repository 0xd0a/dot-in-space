"""Automatic migration

Revision ID: 9ea9b7124756
Revises: 
Create Date: 2020-08-14 23:14:40.983783

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9ea9b7124756'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('password', sa.String(length=128), nullable=False),
    sa.Column('email', sa.String(length=128), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('dot',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('lat1', sa.Float(), nullable=False),
    sa.Column('lon1', sa.Float(), nullable=False),
    sa.Column('lat2', sa.Float(), nullable=False),
    sa.Column('lon2', sa.Float(), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('dot_files',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('file_name', sa.Text(), nullable=False),
    sa.Column('dot_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['dot_id'], ['dot.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('dot_files')
    op.drop_table('dot')
    op.drop_table('user')
    # ### end Alembic commands ###
