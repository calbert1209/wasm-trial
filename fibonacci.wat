(module
 (table 0 anyfunc)
 (memory $0 1)
 (export "memory" (memory $0))
 (export "_Z3fibi" (func $_Z3fibi))
 (func $_Z3fibi (; 0 ;) (param $0 i32) (result i32)
  (block $label$0
   (br_if $label$0
    (i32.ge_s
     (get_local $0)
     (i32.const 2)
    )
   )
   (return
    (get_local $0)
   )
  )
  (i32.add
   (call $_Z3fibi
    (i32.add
     (get_local $0)
     (i32.const -1)
    )
   )
   (call $_Z3fibi
    (i32.add
     (get_local $0)
     (i32.const -2)
    )
   )
  )
 )
)
