import sys, os
sys.path.append(r'c:/Users/User/Desktop/valuerbot/backend')
from app import PreprocessRequest
print('Fields:', list(PreprocessRequest.__fields__.keys()))
