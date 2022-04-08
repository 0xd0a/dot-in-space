import re

str="\n\n\r x = [0   , 2, 3]\nasdf\n1234"
#str="abc"
a=re.findall('.*?x *?= *?\[(.*?)\] *?$',str,re.M)
#a=re.search("x.*?",str)
if(a):
    print(a[0])
    b=re.split(",",)
