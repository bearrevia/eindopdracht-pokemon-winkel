"""add is_admin to users

Revision ID: 4e931faa1472
Revises: 0303dfe4b94b
Create Date: 2026-02-04 15:47:57.727052

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4e931faa1472'
down_revision: Union[str, Sequence[str], None] = '0303dfe4b94b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Voeg kolom toe met default waarde False
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), nullable=False, server_default=sa.text('false')))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'is_admin')
