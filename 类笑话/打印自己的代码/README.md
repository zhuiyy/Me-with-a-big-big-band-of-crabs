### 这个太神秘了
```python
s = 's = %r\nprint s %% s'
print (s % s)
```

输出:

    s = 's = %r\nprint s %% s'
    print (s % s)

##### 本质上应该是调用了某些包, 不太严格
