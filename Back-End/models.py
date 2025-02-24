from sqlalchemy import Boolean, Column, ForeignKey, Integer,String,DateTime
from database import Base

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer,primary_key=True,index=True)
    username = Column(String,index=False)
    email = Column(String,index=True,nullable=False)
    password = Column(String,nullable=False)
    role = Column(Integer,nullable=False)

class Comments(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True,index=True)
    comment_text =  Column(String,index=True)
    owner_email = Column(String, nullable=False)
    send_email = Column(String,nullable=False)
    create_at = Column(DateTime,nullable=False)