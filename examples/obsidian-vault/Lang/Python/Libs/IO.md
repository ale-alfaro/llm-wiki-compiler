---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
#python #io #embedded #shell

Useful when working with bytes and strings.
Need to check if it works well with async [[Anyio by Examples]]

> Raw byte streams such as sockets can be wrapped with a layer to handle string encoding
> and decoding, making it easier to use them with text data.
> The `TextIOWrapper` class supports writing as well as reading.
> The `write_through` argument disables buffering, and flushes all data written to the
> wrapper through to the underlying buffer immediately.
> [Source](https://pymotw.com/3/io/index.html#wrapping-byte-streams-for-text-data)

```python

import io 
# Writing to a buffer 
output = io.BytesIO() 
wrapper = io.TextIOWrapper( output, encoding='utf-8', write_through=True, ) wrapper.write('This goes into the buffer. ') 
wrapper.write('ÁÇÊ') 
# Retrieve the value written 
print(output.getvalue()) 
output.close() 
# discard buffer memory 
# Initialize a read buffer 
input = io.BytesIO( b'Inital value for read buffer with unicode characters ' + 'ÁÇÊ'.encode('utf-8') ) 


wrapper = io.TextIOWrapper(input, encoding='utf-8') # Read from the buffer
# Read from the buffer
print(wrapper.read())

# output 
# b'This goes into the buffer. \xc3\x81\xc3\x87\xc3\x8a'
# inital value for read buffer with unicode characters ÁÇÊ
```
