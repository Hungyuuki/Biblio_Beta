//file này để xử lý code của code trong data.json
export const generateCode = (value) => { //truyền vào value để generate ra code
    let output = '' //output là code, gán bằng một chuỗi rỗng
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').forEach(item => {
        output += item.charAt(1) + item.charAt(0)
    });
    return output.toUpperCase() + value.length
}






