
def get_parameters(parameters):
    l = parameters.count(",") + 1
    params = ""
    for i in range(l):
        params += f"dataset['input'][{i}],"
    params = params[:-1]
    return params


def python_code(func, parameters, code):
    prefix = '''
import json, math, sys
from datetime import datetime

f = open("test.json", "r")
data = json.load(f)
def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

try:
'''
    params = get_parameters(parameters)
    suffix = f'''


    error = False
    program_start = datetime.now()
    for dataset in data:
        output = {func}({params})
        if output != dataset["expected"]:
            error = True''' + '''
#            eprint("Error")
            eprint(f"Input: {str(dataset['input'])[1:-1]}")
            eprint(f"Output: {output}")
            eprint(f"Expected: {dataset['expected']}")
            print("Error")
            break
    program_end = datetime.now()
    program_time = program_end - program_start
    if not error:
        print(f"{math.ceil(program_time.seconds*1000 + program_time.microseconds/1000)}ms")
except Exception as e:
    eprint(e)
    print("Error")
    '''
    return prefix + code.replace("\t", "    ") + suffix


def javascript_code(func, parameters, code):
    prefix = '''
try {
    const data = require("./test.json");
    '''
    parameters = get_parameters(parameters)
    suffix = '''
    const start = new Date();
    let error = false;
    data.forEach(dataset => {''' + f'''
        if(error)return;
        const output = {func}({parameters});''' + '''
        if (output !== dataset.expected) {
            error = true;
            console.error(`Input: ${JSON.stringify(dataset.input).slice(1,-1)}`);
            console.error(`Output: ${JSON.stringify(output)}`);
            console.error(`Expected: ${JSON.stringify(dataset.expected)}`);
            console.log("Error");
        }
    });
    const end = new Date();
    if(!error)console.log(end - start, "ms");
} catch (e) {
    console.error(e);
    console.error("Error");
}
'''
    return prefix + code + suffix


def get_code(func, parameters, language, code):
    if language == 'Python':
        return python_code(func, parameters, code)
    elif language == 'JavaScript':
        return javascript_code(func, parameters, code)
