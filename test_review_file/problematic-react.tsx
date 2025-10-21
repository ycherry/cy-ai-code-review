// React组件测试文件，包含前端开发中的常见问题

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

// 1. 性能问题 - 缺少React.memo和useMemo
export function InefficientComponent({ data, onUpdate }) {
  const [count, setCount] = useState(0)
  
  // 每次都重新计算，应该使用useMemo
  const expensiveValue = data.reduce((sum, item) => sum + item.value, 0)
  
  // 每次都重新创建函数，应该使用useCallback
  const handleClick = () => {
    onUpdate(count + 1)
  }
  
  return (
    <div>
      <p>Expensive value: {expensiveValue}</p>
      <button onClick={handleClick}>Count: {count}</button>
    </div>
  )
}

// 2. 安全性问题 - XSS漏洞
export function UnsafeHTMLRenderer({ content }) {
  // 危险：直接渲染HTML内容，可能导致XSS攻击
  return <div dangerouslySetInnerHTML={{ __html: content }} />
}

// 3. 性能问题 - 内存泄漏 - 事件监听器未清理
export function LeakyComponent() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    
    // 缺少cleanup函数，会导致内存泄漏
  }, [])
  
  return <div>Window width: {windowWidth}</div>
}

// 4. 代码规范问题 - 缺少TypeScript类型
export function UntypedComponent({ user, items, callback }) {
  // 所有props都没有类型定义
  return (
    <div>
      <h1>{user.name}</h1>
      {items.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
      <button onClick={callback}>Click me</button>
    </div>
  )
}

// 5. 性能问题 - 不必要的重新渲染
export function ReRenderComponent({ data }) {
  const [localState, setLocalState] = useState(0)
  
  // 每次渲染都会创建新的对象，导致子组件重新渲染
  const config = {
    theme: 'dark',
    size: 'large'
  }
  
  return (
    <div>
      <ChildComponent data={data} config={config} />
      <button onClick={() => setLocalState(localState + 1)}>
        Update: {localState}
      </button>
    </div>
  )
}

// 6. 安全性问题 - 敏感信息暴露
export function UserProfile({ user }) {
  // 危险：在前端直接显示敏感信息
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p> {/* 不应该显示密码 */}
      <p>API Key: {user.apiKey}</p> {/* 不应该显示API密钥 */}
    </div>
  )
}

// 7. 性能问题 - 低效的状态更新
export function InefficientStateUpdate() {
  const [items, setItems] = useState([])
  
  const addItem = (newItem) => {
    // 低效：每次都创建新数组
    setItems([...items, newItem])
  }
  
  const removeItem = (index) => {
    // 低效：每次都创建新数组
    setItems(items.filter((_, i) => i !== index))
  }
  
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          {item}
          <button onClick={() => removeItem(index)}>Remove</button>
        </div>
      ))}
      <button onClick={() => addItem('New Item')}>Add Item</button>
    </div>
  )
}

// 8. 代码规范问题 - 过深的嵌套
export function DeeplyNestedComponent({ data }) {
  return (
    <div>
      {data.map(section => (
        <div key={section.id}>
          {section.items.map(item => (
            <div key={item.id}>
              {item.comments.map(comment => (
                <div key={comment.id}>
                  {comment.replies.map(reply => (
                    <div key={reply.id}>
                      {reply.content}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// 9. 安全性问题 - 不安全的API调用
export function UnsafeApiCall() {
  const [data, setData] = useState(null)
  
  const fetchData = async () => {
    try {
      // 危险：没有验证URL，可能导致SSRF攻击
      const response = await axios.get(`/api/users/${window.location.search}`)
      setData(response.data)
    } catch (error) {
      console.error(error) // 没有适当的错误处理
    }
  }
  
  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}

// 10. 性能问题 - 缺少错误边界
export function ComponentWithoutErrorBoundary() {
  const [error, setError] = useState(null)
  
  if (error) {
    // 没有适当的错误处理，可能导致整个应用崩溃
    throw new Error('Something went wrong')
  }
  
  return <div>Normal content</div>
}

// 11. 代码规范问题 - 魔法数字和字符串
export function ComponentWithMagicValues({ status }) {
  return (
    <div>
      {status === 1 && <span className="status-active">Active</span>}
      {status === 2 && <span className="status-inactive">Inactive</span>}
      {status === 3 && <span className="status-pending">Pending</span>}
      {/* 应该使用常量而不是魔法数字 */}
    </div>
  )
}

// 12. 安全性问题 - 不安全的localStorage使用
export function UnsafeStorageComponent() {
  const [userData, setUserData] = useState(null)
  
  useEffect(() => {
    // 危险：直接存储敏感信息到localStorage
    const stored = localStorage.getItem('userData')
    if (stored) {
      setUserData(JSON.parse(stored)) // 没有验证数据格式
    }
  }, [])
  
  const saveData = () => {
    // 危险：存储敏感信息
    localStorage.setItem('userData', JSON.stringify({
      username: 'admin',
      password: 'password123',
      token: 'secret-token'
    }))
  }
  
  return (
    <div>
      <button onClick={saveData}>Save Data</button>
      {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}
    </div>
  )
}

// 13. 性能问题 - 不必要的effect依赖
export function EffectWithWrongDependencies({ userId }) {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, []) // 缺少userId依赖，可能导致过时的数据
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>
}

// 14. 代码规范问题 - 不一致的命名
export function inconsistentNaming({ user_data, userPreferences, userSettings }) {
  // 命名不一致：下划线、驼峰命名混用
  return (
    <div>
      <h1>{user_data.name}</h1>
      <p>{userPreferences.theme}</p>
      <p>{userSettings.language}</p>
    </div>
  )
}

// 15. 安全性问题 - 不安全的表单处理
export function UnsafeForm() {
  const [formData, setFormData] = useState({})
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // 危险：没有验证表单数据
    fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData) // 直接发送未验证的数据
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <input 
        type="email" 
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <button type="submit">Submit</button>
    </form>
  )
}

// 16. 性能问题 - 低效的列表渲染
export function InefficientList({ items }) {
  return (
    <div>
      {items.map((item, index) => (
        <ExpensiveListItem 
          key={index} // 使用index作为key，性能差
          data={item}
          onClick={() => console.log(item.id)} // 每次都创建新函数
        />
      ))}
    </div>
  )
}

// 17. 代码规范问题 - 缺少PropTypes或TypeScript接口
export function ComponentWithoutTypes({ user, onEdit, onDelete, isVisible }) {
  // 所有props都没有类型定义
  if (!isVisible) return null
  
  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={() => onEdit(user.id)}>Edit</button>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  )
}

// 18. 安全性问题 - 不安全的重定向
export function UnsafeRedirect({ url }) {
  // 危险：没有验证重定向URL
  useEffect(() => {
    window.location.href = url
  }, [url])
  
  return <div>Redirecting...</div>
}

// 19. 性能问题 - 缺少虚拟化
export function LongList({ items }) {
  // 对于长列表，应该使用虚拟化
  return (
    <div>
      {items.map(item => (
        <div key={item.id} style={{ height: '50px' }}>
          {item.name}
        </div>
      ))}
    </div>
  )
}

// 20. 代码规范问题 - 过长的组件
export function TooLongComponent({ data, onUpdate, onDelete, onEdit, config }) {
  // 组件过长，应该拆分成更小的组件
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  
  // 大量业务逻辑...
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase())
  )
  
  const sortedData = filteredData.sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
  })
  
  // 更多业务逻辑...
  
  return (
    <div>
      {/* 大量的JSX... */}
    </div>
  )
}

// 辅助组件
function ChildComponent({ data, config }) {
  return <div>Child: {data.length}</div>
}

function ExpensiveListItem({ data, onClick }) {
  // 模拟昂贵的渲染操作
  const expensiveValue = data.items?.reduce((sum, item) => sum + item.value, 0) || 0
  
  return (
    <div onClick={onClick}>
      {data.name} - {expensiveValue}
    </div>
  )
}

// 辅助函数
async function fetchUser(userId) {
  // 模拟API调用
  return { id: userId, name: 'John Doe' }
}
